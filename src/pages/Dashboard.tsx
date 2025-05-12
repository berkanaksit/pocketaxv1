import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, AlertCircle, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import SubmissionProgress from '../components/SubmissionProgress';
import TaskCard from '../components/TaskCard';
import TaxCalendarWidget from '../components/TaxCalendarWidget';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchSubmissions();
    }
  }, [user]);

  const fetchSubmissions = async () => {
    try {
      const { data } = await supabase
        .from('tax_submissions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1);
      
      setSubmissions(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      setLoading(false);
    }
  };

  // Mock data
  const currentTaxYear = "2023/24";
  const submissionDeadline = "January 31, 2025";
  const daysRemaining = 123;
  
  const submissionProgress = submissions[0]?.progress || 0;
  
  const pendingTasks = [
    { id: 1, title: 'Import your bank statements', path: '/bank-statements', icon: FileText },
    { id: 2, title: 'Review calculated income', path: '/income-analyzer', icon: AlertCircle },
    { id: 3, title: 'Complete expense categories', path: '/expense-calculator', icon: Clock },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to TaxAssist</h1>
        <p className="text-gray-600">Your personal assistant for self-assessment tax returns.</p>
      </div>

      {/* Tax Year Banner */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border-l-4 border-indigo-600">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Tax Year {currentTaxYear}</h2>
            <p className="text-gray-600">Submission deadline: <span className="font-medium">{submissionDeadline}</span></p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center">
            <span className="text-orange-500 font-medium">{daysRemaining} days remaining</span>
            <Link 
              to="/guided-submission" 
              className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Start Submission
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Section */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-sm h-full">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
              </div>
            ) : (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Your Submission Progress</h2>
                <SubmissionProgress progress={submissionProgress} />
              
                <h3 className="font-medium text-gray-900 mt-8 mb-4">Pending Tasks</h3>
                <div className="space-y-4">
                  {pendingTasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Calendar Widget */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm h-full">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Tax Calendar</h2>
            <TaxCalendarWidget />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;