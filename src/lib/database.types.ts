export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users_profile: {
        Row: {
          id: string
          user_id: string
          full_name: string | null
          utr_number: string | null
          phone_number: string | null
          address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name?: string | null
          utr_number?: string | null
          phone_number?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string | null
          utr_number?: string | null
          phone_number?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tax_submissions: {
        Row: {
          id: string
          user_id: string
          tax_year: string
          status: string
          progress: number
          total_income: number
          total_expenses: number
          tax_due: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tax_year: string
          status?: string
          progress?: number
          total_income?: number
          total_expenses?: number
          tax_due?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tax_year?: string
          status?: string
          progress?: number
          total_income?: number
          total_expenses?: number
          tax_due?: number
          created_at?: string
          updated_at?: string
        }
      }
      bank_statements: {
        Row: {
          id: string
          user_id: string
          submission_id: string
          filename: string
          file_size: number
          bank_name: string | null
          statement_period_start: string | null
          statement_period_end: string | null
          file_path: string | null
          file_type: string | null
          processed_at: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          submission_id: string
          filename: string
          file_size: number
          bank_name?: string | null
          statement_period_start?: string | null
          statement_period_end?: string | null
          file_path?: string | null
          file_type?: string | null
          processed_at?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          submission_id?: string
          filename?: string
          file_size?: number
          bank_name?: string | null
          statement_period_start?: string | null
          statement_period_end?: string | null
          file_path?: string | null
          file_type?: string | null
          processed_at?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          statement_id: string
          transaction_date: string
          description: string
          amount: number
          category: string | null
          transaction_type: string
          created_at: string
        }
        Insert: {
          id?: string
          statement_id: string
          transaction_date: string
          description: string
          amount: number
          category?: string | null
          transaction_type: string
          created_at?: string
        }
        Update: {
          id?: string
          statement_id?: string
          transaction_date?: string
          description?: string
          amount?: number
          category?: string | null
          transaction_type?: string
          created_at?: string
        }
      }
    }
  }
}