import React from 'react';
import { CheckCircle } from 'lucide-react';

interface ChecklistProps {
  items: {
    id: string;
    label: string;
    checked: boolean;
  }[];
  onToggle: (id: string) => void;
}

const Checklist: React.FC<ChecklistProps> = ({ items, onToggle }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Checklist</h3>
      <div className="space-y-3">
        {items.map((item) => (
          <label key={item.id} className="flex items-center space-x-3 cursor-pointer">
            <div 
              className={`flex h-5 w-5 items-center justify-center rounded border ${
                item.checked 
                  ? 'bg-green-500 border-green-500' 
                  : 'border-gray-300 hover:border-green-500'
              }`}
              onClick={() => onToggle(item.id)}
            >
              {item.checked && <CheckCircle className="h-4 w-4 text-white" />}
            </div>
            <span className={`text-sm ${item.checked ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
              {item.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default Checklist;