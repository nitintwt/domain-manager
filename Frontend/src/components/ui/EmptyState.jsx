import { ReactNode } from "react";

const EmptyState = ({ icon, title, description, action }) => {
  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4 text-gray-400">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">{description}</p>
      {action}
    </div>
  );
};

export default EmptyState;
