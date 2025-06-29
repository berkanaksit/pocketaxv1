import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, AlertTriangle } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  priority?: 'high' | 'medium' | 'low';
}

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { title, path, icon: Icon, priority = 'medium' } = task;

  const getPriorityStyles = () => {
    switch (priority) {
      case 'high':
        return {
          border: 'border-red-200 hover:border-red-300',
          bg: 'bg-red-50 hover:bg-red-100',
          icon: 'bg-red-100 text-red-600',
          text: 'text-red-900'
        };
      case 'low':
        return {
          border: 'border-green-200 hover:border-green-300',
          bg: 'bg-green-50 hover:bg-green-100',
          icon: 'bg-green-100 text-green-600',
          text: 'text-green-900'
        };
      default:
        return {
          border: 'border-gray-200 hover:border-primary-300',
          bg: 'bg-gray-50 hover:bg-gray-100',
          icon: 'bg-primary-100 text-primary-600',
          text: 'text-gray-900'
        };
    }
  };

  const styles = getPriorityStyles();

  return (
    <Link 
      to={path}
      className={`block p-4 rounded-lg border ${styles.border} ${styles.bg} transition-all duration-200 hover:shadow-md group`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-lg ${styles.icon} group-hover:scale-105 transition-transform duration-200`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="ml-4">
            <p className={`text-sm font-medium ${styles.text} group-hover:text-primary-700 transition-colors duration-200`}>
              {title}
            </p>
            {priority === 'high' && (
              <div className="flex items-center mt-1">
                <AlertTriangle className="h-3 w-3 text-red-500 mr-1" />
                <span className="text-xs text-red-600 font-medium">Priority</span>
              </div>
            )}
          </div>
        </div>
        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all duration-200" />
      </div>
    </Link>
  );
};

export default TaskCard;