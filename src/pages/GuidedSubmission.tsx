import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

import Checklist from '../components/Checklist';

const STEPS = [
  {
    id: 'eligibility',
    name: 'Check Eligibility',
    description: 'Determine if you need to file a Self Assessment'
  },
  {
    id: 'register',
    name: 'Register with HMRC',
    description: 'Complete registration by October 5th'
  },
  {
    id: 'gateway',
    name: 'Government Gateway',
    description: 'Set up or update your account'
  },
  {
    id: 'documents',
    name: 'Gather Documents',
    description: 'Collect all required paperwork'
  },
  {
    id: 'calculate',
    name: 'Calculate Tax',
    description: 'Estimate your tax bill'
  },
  {
    id: 'file',
    name: 'File Return',
    description: 'Submit your tax return'
  },
  {
    id: 'pay',
    name: 'Pay Tax',
    description: 'Pay your tax bill'
  },
  {
    id: 'complete',
    name: 'Post-Filing',
    description: 'Final steps after submission'
  }
];

const GuidedSubmission: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [checklistItems, setChecklistItems] = useState([
    { id: 'need-file', label: 'Need to file?', checked: false },
    { id: 'registered', label: 'Registered & UTR received', checked: false },
    { id: 'gateway', label: 'Gateway activated', checked: false },
    { id: 'paperwork', label: 'All paperwork gathered', checked: false },
    { id: 'calculated', label: 'Tax bill calculated', checked: false },
    { id: 'filed', label: 'Return filed', checked: false },
    { id: 'paid', label: 'Tax paid', checked: false },
    { id: 'archived', label: 'Records archived', checked: false }
  ]);

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleChecklistItem = (id: string) => {
    setChecklistItems(items =>
      items.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Guided Self Assessment Submission</h1>
        <p className="text-gray-600">We'll walk you through the entire process, step by step.</p>
      </div>

      {/* Step navigator */}
      <div className="mb-8">
        <nav aria-label="Progress">
          <ol role="list" className="flex items-center">
            {STEPS.map((step, stepIdx) => (
              <li key={step.id} className={`relative ${stepIdx !== STEPS.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
                {stepIdx < currentStep ? (
                  // Completed step
                  <>
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="h-0.5 w-full bg-indigo-600" />
                    </div>
                    <button
                      onClick={() => setCurrentStep(stepIdx)}
                      className="relative flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-800"
                    >
                      <CheckCircle className="h-5 w-5 text-white" aria-hidden="true" />
                      <span className="sr-only">{step.name}</span>
                    </button>
                  </>
                ) : stepIdx === currentStep ? (
                  // Current step
                  <>
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="h-0.5 w-full bg-gray-200" />
                    </div>
                    <div
                      className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-indigo-600 bg-white"
                      aria-current="step"
                    >
                      <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" aria-hidden="true" />
                      <span className="sr-only">{step.name}</span>
                    </div>
                  </>
                ) : (
                  // Upcoming step
                  <>
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="h-0.5 w-full bg-gray-200" />
                    </div>
                    <div
                      className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white hover:border-gray-400"
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300"
                        aria-hidden="true"
                      />
                      <span className="sr-only">{step.name}</span>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* Step content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">{STEPS[currentStep].name}</h2>
              <p className="text-gray-600">{STEPS[currentStep].description}</p>
            </div>

            {/* Different content based on current step */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <p className="text-gray-800">You must file a Self Assessment if between 6 April 2024 and 5 April 2025, any of these apply:</p>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>Self-employed profit > £1</li>
                  <li>Property income > £1,000 (after the property allowance)</li>
                  <li>Total income > £100,000</li>
                  <li>Untaxed interest, dividends, crypto or share gains</li>
                  <li>You or your partner had the High-Income Child-Benefit Charge</li>
                  <li>You were a company director and drew untaxed income</li>
                </ul>
                
                <div className="mt-6 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-amber-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-amber-800">Important Note</h3>
                      <div className="mt-2 text-sm text-amber-700">
                        <p>If none of these criteria apply to you, you may not need to file a Self Assessment.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="prose">
                  <h3>Registration Forms</h3>
                  <div className="mt-4">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            If you are
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Form to use
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            How to register
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            Self-employed or sole trader
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            CWF1
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            Complete it online; HMRC issues a UTR by post
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            Not self-employed
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            SA1
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            Use the on-screen questions, submit electronically
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            Partner in a partnership
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            SA400
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            One form per partnership plus SA401 for each partner
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Important Deadlines</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>Register by October 5th to avoid "failure to notify" penalties. HMRC posts the UTR within:</p>
                        <ul className="list-disc pl-5 mt-2">
                          <li>10 days (UK residents)</li>
                          <li>21 days (if abroad)</li>
                        </ul>
                      </div>
                      <div className="mt-3">
                        <a
                          href="https://www.gov.uk/register-for-self-assessment"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                        >
                          Register on GOV.UK
                          <ExternalLink className="ml-1 h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step navigation buttons */}
            <div className="mt-8 flex justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md ${
                  currentStep === 0 ? 'text-gray-400 bg-gray-100' : 'text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </button>
              
              <button
                onClick={nextStep}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {currentStep === STEPS.length - 1 ? 'Finish' : 'Next'}
                <ChevronRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            {/* Progress Overview */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Your Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-gray-500">Completion</span>
                    <span className="text-gray-900">
                      {Math.round((currentStep / (STEPS.length - 1)) * 100)}%
                    </span>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(currentStep / (STEPS.length - 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  {currentStep === STEPS.length - 1
                    ? "You're all set!"
                    : `${STEPS.length - currentStep - 1} steps remaining`}
                </p>
              </div>
            </div>

            {/* Checklist */}
            <Checklist
              items={checklistItems}
              onToggle={toggleChecklistItem}
            />

            {/* Key Dates */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Key Dates</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-gray-900">October 5, 2024</p>
                  <p className="text-gray-500">Register for Self Assessment</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">January 31, 2025</p>
                  <p className="text-gray-500">Online tax return deadline</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">January 31, 2025</p>
                  <p className="text-gray-500">Pay tax bill for 2023/24</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">July 31, 2025</p>
                  <p className="text-gray-500">Payment on account (second)</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <a
                  href="#"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  View full tax calendar
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidedSubmission;