import { createClient } from 'npm:@supabase/supabase-js@2.39.7';
import { parse as parseCSV } from 'npm:csv-parse/sync';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

interface Transaction {
  transaction_date: string;
  description: string;
  amount: number;
  category?: string;
  confidence?: number;
}

function categorizeTransaction(description: string, amount: number): { category: string; confidence: number } {
  description = description.toLowerCase();
  
  // Income categorization
  if (amount > 0) {
    if (description.includes('salary') || description.includes('payroll')) {
      return { category: 'income_employment', confidence: 0.9 };
    }
    if (description.includes('dividend') || description.includes('interest')) {
      return { category: 'income_investments', confidence: 0.9 };
    }
    return { category: 'income_self_employment', confidence: 0.7 };
  }

  // Expense categorization
  const categories = [
    { keywords: ['rent', 'office', 'utilities'], category: 'expense_office' },
    { keywords: ['train', 'taxi', 'fuel', 'parking'], category: 'expense_travel' },
    { keywords: ['computer', 'laptop', 'equipment'], category: 'expense_equipment' },
    { keywords: ['accountant', 'legal', 'insurance'], category: 'expense_legal' },
    { keywords: ['advertising', 'marketing'], category: 'expense_marketing' },
    { keywords: ['training', 'course', 'conference'], category: 'expense_training' }
  ];

  for (const cat of categories) {
    if (cat.keywords.some(keyword => description.includes(keyword))) {
      return { category: cat.category, confidence: 0.8 };
    }
  }

  return { category: 'expense_other', confidence: 0.5 };
}

async function processCSV(content: string): Promise<Transaction[]> {
  try {
    const records = parseCSV(content, {
      columns: true,
      skip_empty_lines: true
    });

    return records.map((record: any) => {
      const amount = parseFloat(record.amount || record.credit || record.debit || '0');
      const { category, confidence } = categorizeTransaction(record.description, amount);

      return {
        transaction_date: record.date,
        description: record.description.trim(),
        amount,
        category,
        confidence
      };
    }).filter(t => t.amount !== 0);
  } catch (error) {
    console.error('CSV parsing error:', error);
    throw new Error('Invalid CSV format');
  }
}

async function processPDF(content: string): Promise<Transaction[]> {
  // Extract transactions from PDF text content
  const transactions: Transaction[] = [];
  const lines = content.split('\n');

  for (const line of lines) {
    // Match common date formats and amounts
    const match = line.match(/(\d{2}[-/]\d{2}[-/]\d{4})\s+(.+?)\s+([-]?\d+\.?\d*)/);
    if (match) {
      const [_, date, description, amount] = match;
      const parsedAmount = parseFloat(amount);
      const { category, confidence } = categorizeTransaction(description, parsedAmount);

      if (!isNaN(parsedAmount) && parsedAmount !== 0) {
        transactions.push({
          transaction_date: date,
          description: description.trim(),
          amount: parsedAmount,
          category,
          confidence
        });
      }
    }
  }

  return transactions;
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { statement_id, file_type, content } = await req.json();

    if (!statement_id || !file_type || !content) {
      throw new Error('Missing required parameters');
    }

    // Update status to processing
    await supabaseClient
      .from('bank_statements')
      .update({ status: 'processing' })
      .eq('id', statement_id);

    // Process the file based on type
    let transactions: Transaction[] = [];
    if (file_type === 'text/csv') {
      transactions = await processCSV(content);
    } else if (file_type === 'application/pdf') {
      transactions = await processPDF(content);
    } else {
      throw new Error('Unsupported file type');
    }

    // Insert transactions
    const { error: insertError } = await supabaseClient
      .from('transactions')
      .insert(
        transactions.map(t => ({
          statement_id,
          ...t
        }))
      );

    if (insertError) throw insertError;

    // Update statement status
    const { error: updateError } = await supabaseClient
      .from('bank_statements')
      .update({ 
        status: 'processed',
        processed_at: new Date().toISOString(),
        transaction_count: transactions.length
      })
      .eq('id', statement_id);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({ 
        success: true,
        transaction_count: transactions.length 
      }),
      { 
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );

  } catch (error) {
    // Update statement status to failed
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    await supabaseClient
      .from('bank_statements')
      .update({ 
        status: 'failed',
        processing_error: error.message
      })
      .eq('id', statement_id);

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  }
});