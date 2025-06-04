import { cn} from '../../lib/utils'

const StatusBadge = ({ status, children }) => {
  const variants = {
    success: "bg-green-100 text-green-800 border-green-200",
    error: "bg-red-100 text-red-800 border-red-200", 
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    pending: "bg-gray-100 text-gray-800 border-gray-200"
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
      variants[status]
    )}>
      {children}
    </span>
  );
};

export default StatusBadge;