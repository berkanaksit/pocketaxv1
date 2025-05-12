import React from 'react';
import { CheckCircle } from 'lucide-react';

interface SubmissionProgressProps {
  progress: number;
}

const SubmissionProgress: React.FC<SubmissionProgressProps> = ({ progress }) => {
  const steps = [
    { id: 1, name: 'Preparation', description: 'Gather your documents', status: progress >= 20 ? 'complete' : progress > 0 ? 'in-progress' : 'upcoming' },
    { id: 2, name: 'Income', description: 'Calculate your income', status: progress >= 40 ? 'complete' : progress >= 20 ? 'in-progress' : 'upcoming' },
    { id: 3, name: 'Expenses', description: 'Review your expenses', status: progress >= 60 ? 'complete' : progress >= 40 ? 'in-progress' : 'upcoming' },
    { id: 4, name: 'Deductions', description: 'Apply eligible tax relief', status: progress >= 80 ? 'complete' : progress >= 60 ? 'in-progress' : 'upcoming' },
    { id: 5, name: 'Submission', description: 'Submit to HMRC', status: progress >= 100 ? 'complete' : progress >= 80 ? 'in-progress' : 'upcoming' },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-teal-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="ml-4 text-sm font-medium text-gray-700">{progress}%</span>
      </div>

      <div className="space-y-6">
        {steps.map((step, stepIdx) => (
          <div key={step.id} className="relative flex items-start">
            <div className="flex items-center h-9">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-full">
                {step.status === 'complete' ? (
                  <CheckCircle className="w-8 h-8 text-teal-600" />
                ) : (
                  <span
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      step.status === 'in-progress' ? 'bg-indigo-600 text-white' : 'border-2 border-gray-300 text-gray-500'
                    }`}
                  >
                    {step.id}
                  </span>
                )}
              </div>
            </div>
            <div className="ml-4 min-w-0">
              <div className="text-sm font-medium text-gray-900">{step.name}</div>
              <div className="text-sm text-gray-500">{step.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubmissionProgress;