import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { title, path, icon: Icon } = task;

  return (
    <Link 
      to={path}
      className="block p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition duration-150 ease-in-out"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100 text-indigo-600">
            <Icon className="h-5 w-5" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-900">{title}</p>
          </div>
        </div>
        <ArrowRight className="h-5 w-5 text-gray-400" />
      </div>
    </Link>
  );
};

export default TaskCard;