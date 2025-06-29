import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, AlertCircle, CheckCircle, Clock, Loader2, TrendingUp, Calculator, PoundSterling, Calendar, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import SubmissionProgress from '../components/SubmissionProgress';
import TaskCard from '../components/TaskCard';
import TaxCalendarWidget from '../components/TaxCalendarWidget';

interface TaxSubmission {
  id: string;
  tax_year: string;
  status: string;
  progress: number;
  total_income: number;
  total_expenses: number;
  tax_due: number;
  created_at: string;
  updated_at: string;
}

interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  estimatedTax: number;
  statementsUploaded: number;
  transactionsProcessed: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<TaxSubmission[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalIncome: 0,
    totalExpenses: 0,
    estimatedTax: 0,
    statementsUploaded: 0,
    transactionsProcessed: 0
  });

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch latest tax submission
      const { data: submissionData } = await supabase
        .from('tax_submissions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1);
      
      setSubmissions(submissionData || []);
      
      // Fetch bank statements count
      const { count: statementsCount } = await supabase
        .from('bank_statements')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id)
        .eq('status', 'processed');
      
      // Fetch transactions count
      const { count: transactionsCount } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .in('statement_id', []);

      // For now, get transactions count through bank statements
      const { data: statementsWithTransactions } = await supabase
        .from('bank_statements')
        .select('transaction_count')
        .eq('user_id', user?.id)
        .eq('status', 'processed');

      const totalTransactions = statementsWithTransactions?.reduce((sum, stmt) => sum + (stmt.transaction_count || 0), 0) || 0;
      
      const currentSubmission = submissionData?.[0];
      
      setStats({
        totalIncome: currentSubmission?.total_income || 0,
        totalExpenses: currentSubmission?.total_expenses || 0,
        estimatedTax: currentSubmission?.tax_due || 0,
        statementsUploaded: statementsCount || 0,
        transactionsProcessed: totalTransactions
      });
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Current tax year and deadline
  const currentTaxYear = "2023/24";
  const submissionDeadline = "January 31, 2025";
  const deadlineDate = new Date('2025-01-31');
  const today = new Date();
  const daysRemaining = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  const currentSubmission = submissions[0];
  const submissionProgress = currentSubmission?.progress || 0;
  
  // Dynamic pending tasks based on actual data
  const getPendingTasks = () => {
    const tasks = [];
    
    if (stats.statementsUploaded === 0) {
      tasks.push({ 
        id: 1, 
        title: 'Upload your bank statements', 
        path: '/dashboard/bank-statements', 
        icon: FileText,
        priority: 'high'
      });
    }
    
    if (stats.totalIncome === 0 && stats.statementsUploaded > 0) {
      tasks.push({ 
        id: 2, 
        title: 'Review calculated income', 
        path: '/dashboard/income-analyzer', 
        icon: TrendingUp,
        priority: 'high'
      });
    }
    
    if (stats.totalExpenses === 0) {
      tasks.push({ 
        id: 3, 
        title: 'Add business expenses', 
        path: '/dashboard/expense-calculator', 
        icon: Calculator,
        priority: 'medium'
      });
    }
    
    if (submissionProgress < 100 && stats.totalIncome > 0) {
      tasks.push({ 
        id: 4, 
        title: 'Complete submission summary', 
        path: '/dashboard/submission-summary', 
        icon: CheckCircle,
        priority: 'medium'
      });
    }
    
    // If no tasks, show a completion task
    if (tasks.length === 0) {
      tasks.push({ 
        id: 5, 
        title: 'Review and submit to HMRC', 
        path: '/dashboard/submission-summary', 
        icon: CheckCircle,
        priority: 'low'
      });
    }
    
    return tasks;
  };

  const pendingTasks = getPendingTasks();

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
            <p className="text-primary-100 text-lg">Let's get your tax return sorted for {currentTaxYear}</p>
          </div>
          <div className="text-center lg:text-right">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-sm text-primary-100 mb-1">Days remaining</div>
              <div className="text-4xl font-bold">{daysRemaining}</div>
              <div className="text-sm text-primary-100">until deadline</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <PoundSterling className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Income</p>
              <p className="text-2xl font-bold text-gray-900">£{stats.totalIncome.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="bg-red-100 rounded-lg p-3">
              <Calculator className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">£{stats.totalExpenses.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Estimated Tax</p>
              <p className="text-2xl font-bold text-gray-900">£{stats.estimatedTax.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Statements</p>
              <p className="text-2xl font-bold text-gray-900">{stats.statementsUploaded}</p>
              <p className="text-xs text-gray-500">{stats.transactionsProcessed} transactions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tax Year Status Banner */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-semibold text-gray-900">Tax Year {currentTaxYear}</h2>
            <p className="text-gray-600">Submission deadline: <span className="font-medium text-red-600">{submissionDeadline}</span></p>
            <div className="mt-2 flex items-center">
              <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                {daysRemaining} days remaining
              </div>
              <div className="ml-3 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                {submissionProgress}% complete
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link 
              to="/dashboard/submission-summary" 
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              Review Progress
            </Link>
            <Link 
              to="/dashboard/submission-summary" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              Continue Submission
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 h-full">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 text-primary-600 animate-spin mx-auto mb-4" />
                  <p className="text-gray-500">Loading your progress...</p>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Your Submission Progress</h2>
                  <div className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                    {submissionProgress}% Complete
                  </div>
                </div>
                
                <SubmissionProgress progress={submissionProgress} />
              
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Next Steps</h3>
                    <span className="text-sm text-gray-500">{pendingTasks.length} task{pendingTasks.length !== 1 ? 's' : ''} pending</span>
                  </div>
                  <div className="space-y-3">
                    {pendingTasks.map(task => (
                      <div key={task.id} className="group">
                        <TaskCard task={task} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Calendar Widget */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit">
            <div className="flex items-center mb-4">
              <Calendar className="h-5 w-5 text-primary-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Important Dates</h2>
            </div>
            <TaxCalendarWidget />
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/dashboard/bank-statements"
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 border border-gray-200"
              >
                <FileText className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-sm font-medium text-gray-700">Upload Statements</span>
              </Link>
              <Link
                to="/dashboard/expense-calculator"
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 border border-gray-200"
              >
                <Calculator className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-sm font-medium text-gray-700">Add Expenses</span>
              </Link>
              <Link
                to="/dashboard/help-center"
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 border border-gray-200"
              >
                <Users className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-sm font-medium text-gray-700">Get Help</span>
              </Link>
            </div>
          </div>

          {/* Tax Tip */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
            <div className="flex items-start">
              <div className="bg-blue-100 rounded-lg p-2 mr-3">
                <AlertCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-blue-900 mb-1">Tax Tip</h3>
                <p className="text-sm text-blue-800">
                  Keep digital copies of all receipts and bank statements. The more organized your records, the easier your tax return will be!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;