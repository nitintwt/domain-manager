import { Link, useLocation } from "react-router-dom";
import { Cloud, Server, X, LayoutDashboard} from "lucide-react";
import { cn } from "../../lib/utils";

const navigation = [
  { 
    name: "Cloudflare Accounts", 
    href: "/cloudflare", 
    icon: Cloud,
  },
  { 
    name: "Servers", 
    href: "/servers", 
    icon: Server,
  },
  {
    name:"Domains",
    href:"/domain",
    icon:Server
  }
];

const Sidebar = ({ onClose }) => {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Header */}
      <div className="flex items-center h-16 px-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname.startsWith(item.href);
          
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={cn(
                "flex flex-col p-3 rounded-lg transition-all duration-200",
                "hover:bg-gray-50 hover:shadow-sm",
                isActive && "bg-blue-50 shadow-sm border border-blue-100"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-md",
                  isActive ? "bg-blue-100" : "bg-gray-100"
                )}>
                  <item.icon className={cn(
                    "h-5 w-5",
                    isActive ? "text-blue-600" : "text-gray-500"
                  )} />
                </div>
                <div className="flex flex-col">
                  <span className={cn(
                    "font-medium",
                    isActive ? "text-blue-600" : "text-gray-700"
                  )}>
                    {item.name}
                  </span>
                  <span className="text-xs text-gray-500 mt-0.5">
                    {item.description}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600">
          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="font-medium text-gray-700">DN</span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">Domain Manager</span>
            <span className="text-xs text-gray-500">v1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;