import React from 'react';
import { CheckCircle, Clock, ArrowRight } from 'lucide-react';

interface SubmissionProgressProps {
  progress: number;
}

const SubmissionProgress: React.FC<SubmissionProgressProps> = ({ progress }) => {
  const steps = [
    { 
      id: 1, 
      name: 'Preparation', 
      description: 'Gather your documents and information', 
      status: progress >= 20 ? 'complete' : progress > 0 ? 'in-progress' : 'upcoming',
      threshold: 0
    },
    { 
      id: 2, 
      name: 'Income', 
      description: 'Upload and review your income sources', 
      status: progress >= 40 ? 'complete' : progress >= 20 ? 'in-progress' : 'upcoming',
      threshold: 20
    },
    { 
      id: 3, 
      name: 'Expenses', 
      description: 'Categorize business expenses', 
      status: progress >= 60 ? 'complete' : progress >= 40 ? 'in-progress' : 'upcoming',
      threshold: 40
    },
    { 
      id: 4, 
      name: 'Review', 
      description: 'Check calculations and details', 
      status: progress >= 80 ? 'complete' : progress >= 60 ? 'in-progress' : 'upcoming',
      threshold: 60
    },
    { 
      id: 5, 
      name: 'Submission', 
      description: 'Submit to HMRC', 
      status: progress >= 100 ? 'complete' : progress >= 80 ? 'in-progress' : 'upcoming',
      threshold: 80
    },
  ];

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="flex items-center mb-8">
        <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
          <div 
            className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-700 ease-out shadow-sm" 
            style={{ width: `${progress}%` }}
          >
            <div className="h-full bg-white/20 rounded-full"></div>
          </div>
        </div>
        <span className="ml-4 text-lg font-semibold text-gray-700 min-w-[4rem]">{progress}%</span>
      </div>

      {/* Steps */}
      <div className="space-y-6">
        {steps.map((step, stepIdx) => (
          <div key={step.id} className="relative flex items-start group">
            {/* Connector Line */}
            {stepIdx !== steps.length - 1 && (
              <div className="absolute top-10 left-4 h-16 w-0.5 bg-gray-200">
                <div 
                  className={`w-full transition-all duration-500 ${
                    step.status === 'complete' ? 'bg-primary-600 h-full' : 'bg-gray-200 h-0'
                  }`}
                />
              </div>
            )}
            
            {/* Step Circle */}
            <div className="flex items-center h-9">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300">
                {step.status === 'complete' ? (
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center shadow-md">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                ) : step.status === 'in-progress' ? (
                  <div className="w-8 h-8 bg-primary-100 border-2 border-primary-600 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-primary-600" />
                  </div>
                ) : (
                  <div className="w-8 h-8 border-2 border-gray-300 rounded-full flex items-center justify-center bg-white group-hover:border-primary-300 transition-colors duration-200">
                    <span className="text-sm font-medium text-gray-500 group-hover:text-primary-600">
                      {step.id}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Step Content */}
            <div className="ml-4 min-w-0 flex-1">
              <div className="flex items-center">
                <div className={`text-sm font-semibold transition-colors duration-200 ${
                  step.status === 'complete' 
                    ? 'text-primary-700' 
                    : step.status === 'in-progress'
                    ? 'text-primary-600'
                    : 'text-gray-900 group-hover:text-primary-600'
                }`}>
                  {step.name}
                </div>
                {step.status === 'in-progress' && (
                  <ArrowRight className="ml-2 h-4 w-4 text-primary-600 animate-pulse" />
                )}
              </div>
              <div className={`text-sm mt-1 transition-colors duration-200 ${
                step.status === 'complete' 
                  ? 'text-primary-600' 
                  : 'text-gray-500'
              }`}>
                {step.description}
              </div>
              
              {/* Progress indicator for current step */}
              {step.status === 'in-progress' && (
                <div className="mt-2 w-32 bg-gray-200 rounded-full h-1">
                  <div 
                    className="bg-primary-600 h-1 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.max(0, Math.min(100, ((progress - step.threshold) / 20) * 100))}%` 
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Next Step Indicator */}
      {progress < 100 && (
        <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-primary-600 mr-2" />
            <div>
              <div className="text-sm font-medium text-primary-900">
                Next: {steps.find(s => s.status === 'in-progress' || (s.status === 'upcoming' && s.threshold <= progress))?.name || 'Complete Review'}
              </div>
              <div className="text-xs text-primary-700 mt-1">
                {progress < 20 && "Start by uploading your bank statements"}
                {progress >= 20 && progress < 40 && "Review and categorize your income"}
                {progress >= 40 && progress < 60 && "Add your business expenses"}
                {progress >= 60 && progress < 80 && "Review all calculations"}
                {progress >= 80 && progress < 100 && "Prepare for submission"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionProgress;