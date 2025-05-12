import React from 'react';
import { Calendar } from 'lucide-react';

const TaxCalendarWidget: React.FC = () => {
  // Mock important tax dates
  const importantDates = [
    { date: 'October 5, 2024', description: 'Register for Self Assessment' },
    { date: 'January 31, 2025', description: 'Online tax return deadline' },
    { date: 'January 31, 2025', description: 'Pay tax bill for 2023/24' },
    { date: 'July 31, 2025', description: 'Payment on account (second)' },
  ];

  return (
    <div className="space-y-4">
      {importantDates.map((item, index) => (
        <div key={index} className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <Calendar className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{item.date}</p>
            <p className="text-sm text-gray-500">{item.description}</p>
          </div>
        </div>
      ))}
      
      <div className="pt-4 border-t border-gray-200">
        <a 
          href="#" 
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          View full tax calendar
        </a>
      </div>
    </div>
  );
};

export default TaxCalendarWidget;