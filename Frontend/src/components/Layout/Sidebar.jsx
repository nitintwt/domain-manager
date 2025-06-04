import { Link, useLocation } from "react-router-dom";
import { Cloud, Server, X } from "lucide-react";

const navigation = [
  { name: "Cloudflare Accounts", href: "/cloudflare", icon: Cloud },
  { name: "Servers", href: "/servers", icon: Server },
];

const Sidebar = ({ onClose }) => {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={(
                "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <item.icon className={("mr-3 h-5 w-5", isActive ? "text-blue-500" : "text-gray-400")} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
