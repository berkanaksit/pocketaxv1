import React, { useState } from 'react';
import { CheckCircle, AlertCircle, ArrowRight, Download, HelpCircle, Shield, X, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const SubmissionSummary: React.FC = () => {
  const [isReviewing, setIsReviewing] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  
  const submissionSteps = [
    {
      id: 'prepare',
      title: 'Prepare Your Information',
      description: 'Gather all required documents and information',
      tasks: [
        { id: 1, name: 'Upload Bank Statements', path: '/bank-statements', completed: true },
        { id: 2, name: 'Review Income', path: '/income-analyzer', completed: true },
        { id: 3, name: 'Check Expenses', path: '/expense-calculator', completed: false },
      ]
    },
    {
      id: 'verify',
      title: 'Verify Your Details',
      description: 'Double-check all information is correct',
      tasks: [
        { id: 4, name: 'Verify Personal Information', path: '/account-settings', completed: false },
        { id: 5, name: 'Confirm Tax Calculations', path: '/submission-summary', completed: false },
      ]
    },
    {
      id: 'submit',
      title: 'Submit to HMRC',
      description: 'Complete your submission on the HMRC website',
      tasks: [
        { id: 6, name: 'Download Summary PDF', path: '#', completed: false },
        { id: 7, name: 'Submit via HMRC Website', path: 'https://www.gov.uk/log-in-file-self-assessment-tax-return', completed: false },
      ]
    }
  ];
  
  // Mock summary data
  const summaryData = {
    personalDetails: {
      name: 'John Smith',
      utr: '1234567890',
      taxYear: '2023/24',
      completionStatus: 'Complete',
    },
    income: {
      selfEmployment: 35250.00,
      employment: 8500.25,
      investments: 5000.20,
      totalIncome: 48750.45,
      completionStatus: 'Complete',
    },
    expenses: {
      total: 12450.24,
      allowable: 10582.70,
      nonDeductible: 1867.54,
      completionStatus: 'Complete',
    },
    taxCalculation: {
      taxableIncome: 36500.25,
      taxDue: 8526.32,
      nationalInsurance: 3284.25,
      totalTaxDue: 11810.57,
      completionStatus: 'Complete',
    },
    submission: {
      status: 'Not Submitted',
      readyToSubmit: true,
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Ready to Submit?</h1>
        <p className="text-gray-600">Let's make sure everything is ready for HMRC.</p>
      </div>

      {/* Progress Banner */}
      <div className={`rounded-lg shadow-sm p-6 mb-8 ${isReviewing ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-green-50 border-l-4 border-green-500'}`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {isReviewing ? (
              <AlertCircle className="h-6 w-6 text-blue-500" />
            ) : (
              <CheckCircle className="h-6 w-6 text-green-500" />
            )}
          </div>
          <div className="ml-3">
            <h3 className={`text-lg font-medium ${isReviewing ? 'text-blue-800' : 'text-green-800'}`}>
              {isReviewing ? 'Final Review Needed' : 'All Set to Submit!'}
            </h3>
            <div className={`mt-2 text-sm ${isReviewing ? 'text-blue-700' : 'text-green-700'}`}>
              <p>
                {isReviewing 
                  ? 'Take a moment to check everything is correct before submitting.' 
                  : 'Great job! Your tax return is complete and ready for HMRC.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Sections */}
      <div className="space-y-6">
        {/* Step Progress */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Your Progress</h2>
          </div>
          <div className="p-6">
            <div className="space-y-8">
              {submissionSteps.map((step, index) => (
                <div key={step.id} className="relative">
                  {index !== submissionSteps.length - 1 && (
                    <div className="absolute top-8 left-4 h-full w-0.5 bg-gray-200" />
                  )}
                  <div className="relative flex items-start group">
                    <div className="flex items-center h-8">
                      <span className="relative z-10 flex items-center justify-center w-8 h-8 bg-white rounded-full border-2 border-indigo-600 text-indigo-600 font-medium">
                        {index + 1}
                      </span>
                    </div>
                    <div className="ml-4 min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900">{step.title}</div>
                      <div className="text-sm text-gray-500">{step.description}</div>
                      <div className="mt-3 space-y-2">
                        {step.tasks.map((task) => (
                          <div key={task.id} className="flex items-center">
                            {task.completed ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <div className="h-4 w-4 border-2 border-gray-300 rounded-full" />
                            )}
                            <Link
                              to={task.path}
                              className="ml-3 text-sm text-gray-600 hover:text-gray-900"
                            >
                              {task.name}
                              {task.path.startsWith('http') && (
                                <ExternalLink className="inline-block ml-1 h-3 w-3" />
                              )}
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Personal Details */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Personal Details</h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <CheckCircle className="h-4 w-4 mr-1" />
                Complete
              </span>
            </div>
          </div>
          <div className="px-6 py-4">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{summaryData.personalDetails.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">UTR (Unique Taxpayer Reference)</dt>
                <div className="group relative">
                  <HelpCircle className="absolute -right-6 top-1 h-4 w-4 text-gray-400 cursor-help" />
                  <div className="invisible group-hover:visible absolute -right-4 top-6 w-48 bg-gray-900 text-white text-xs rounded p-2 z-10">
                    Your UTR is a unique 10-digit number from HMRC used to identify your tax records
                  </div>
                </div>
                <dd className="mt-1 text-sm text-gray-900">{summaryData.personalDetails.utr}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Tax Year</dt>
                <dd className="mt-1 text-sm text-gray-900">{summaryData.personalDetails.taxYear}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Income */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Income Summary</h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <CheckCircle className="h-4 w-4 mr-1" />
                Complete
              </span>
            </div>
          </div>
          <div className="px-6 py-4">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Self-employment Income</dt>
                <dd className="mt-1 text-sm text-gray-900">£{summaryData.income.selfEmployment.toFixed(2)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Employment Income</dt>
                <dd className="mt-1 text-sm text-gray-900">£{summaryData.income.employment.toFixed(2)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Investment Income</dt>
                <dd className="mt-1 text-sm text-gray-900">£{summaryData.income.investments.toFixed(2)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Total Income</dt>
                <dd className="mt-1 text-sm font-semibold text-gray-900">£{summaryData.income.totalIncome.toFixed(2)}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Expenses */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Expenses Summary</h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <CheckCircle className="h-4 w-4 mr-1" />
                Complete
              </span>
            </div>
          </div>
          <div className="px-6 py-4">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Total Expenses</dt>
                <dd className="mt-1 text-sm text-gray-900">£{summaryData.expenses.total.toFixed(2)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Allowable Expenses</dt>
                <dd className="mt-1 text-sm text-gray-900">£{summaryData.expenses.allowable.toFixed(2)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Non-deductible Expenses</dt>
                <div className="group relative">
                  <HelpCircle className="absolute -right-6 top-1 h-4 w-4 text-gray-400 cursor-help" />
                  <div className="invisible group-hover:visible absolute -right-4 top-6 w-48 bg-gray-900 text-white text-xs rounded p-2 z-10">
                    Expenses that cannot be claimed against your tax bill
                  </div>
                </div>
                <dd className="mt-1 text-sm text-gray-900">£{summaryData.expenses.nonDeductible.toFixed(2)}</dd>
              </div>
              <div>
                <dt className="flex items-center text-sm font-medium text-gray-500">
                  <span>Net Profit</span>
                  <HelpCircle className="ml-1 h-4 w-4 text-gray-400" />
                </dt>
                <dd className="mt-1 text-sm font-semibold text-gray-900">
                  £{(summaryData.income.selfEmployment - summaryData.expenses.allowable).toFixed(2)}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Tax Calculation */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Tax Calculation</h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <CheckCircle className="h-4 w-4 mr-1" />
                Complete
              </span>
            </div>
          </div>
          <div className="px-6 py-4">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Taxable Income</dt>
                <dd className="mt-1 text-sm text-gray-900">£{summaryData.taxCalculation.taxableIncome.toFixed(2)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Income Tax Due</dt>
                <dd className="mt-1 text-sm text-gray-900">£{summaryData.taxCalculation.taxDue.toFixed(2)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">National Insurance</dt>
                <div className="group relative">
                  <HelpCircle className="absolute -right-6 top-1 h-4 w-4 text-gray-400 cursor-help" />
                  <div className="invisible group-hover:visible absolute -right-4 top-6 w-48 bg-gray-900 text-white text-xs rounded p-2 z-10">
                    A separate tax that helps pay for state benefits and the NHS
                  </div>
                </div>
                <dd className="mt-1 text-sm text-gray-900">£{summaryData.taxCalculation.nationalInsurance.toFixed(2)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Total Tax Due</dt>
                <dd className="mt-1 text-sm font-semibold text-gray-900">£{summaryData.taxCalculation.totalTaxDue.toFixed(2)}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Final Steps */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Final Steps</h2>
          
          <ol className="ml-6 space-y-6">
            <li className="relative pb-6 pl-8">
              <div className="absolute top-0 left-0 h-full w-8">
                <div className="absolute top-5 left-3 h-full w-px bg-gray-200"></div>
                <div className="absolute top-3 left-1.5 h-5 w-5 rounded-full bg-indigo-200 flex items-center justify-center">
                  <span className="text-indigo-700 text-sm font-medium">1</span>
                </div>
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-900">Review Your Return</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Carefully check all sections of your tax return for accuracy and completeness.
                </p>
                <button
                  className="mt-2 text-sm text-indigo-600 font-medium hover:text-indigo-500"
                  onClick={() => setIsReviewing(!isReviewing)}
                >
                  {isReviewing ? 'Mark as reviewed' : 'Mark as not reviewed'}
                </button>
              </div>
            </li>
            <li className="relative pb-6 pl-8">
              <div className="absolute top-0 left-0 h-full w-8">
                <div className="absolute top-5 left-3 h-full w-px bg-gray-200"></div>
                <div className="absolute top-3 left-1.5 h-5 w-5 rounded-full bg-indigo-200 flex items-center justify-center">
                  <span className="text-indigo-700 text-sm font-medium">2</span>
                </div>
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-900">Generate PDF</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Download a PDF copy of your tax return for your records.
                </p>
                <button
                  className="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download PDF
                </button>
              </div>
            </li>
            <li className="relative pl-8">
              <div className="absolute top-0 left-0 h-full w-8">
                <div className="absolute top-3 left-1.5 h-5 w-5 rounded-full bg-indigo-200 flex items-center justify-center">
                  <span className="text-indigo-700 text-sm font-medium">3</span>
                </div>
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-900">Submit to HMRC</h3>
                <p className="mt-1 text-sm text-gray-600">
                  When ready, follow our guided process to submit your return to HMRC.
                </p>
                <a
                  href="https://www.gov.uk/log-in-file-self-assessment-tax-return"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                    !isReviewing
                      ? 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                  onClick={(e) => isReviewing && e.preventDefault()}
                >
                  Go to HMRC Website
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default SubmissionSummary;