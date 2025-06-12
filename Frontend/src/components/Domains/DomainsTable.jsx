import {Trash2, BrushCleaning} from "lucide-react";
import { Button } from "@heroui/button";
import axios from "axios";
import { toast } from "sonner";

const EnhancedDomainsTable = ({ domains, setDomains , handleDelete , setIsCheckingAll}) => {

  const getStatusBadge = (status, type) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    
    if (type === 'general') {
      switch (status?.toLowerCase()) {
        case "active":
          return `${baseClasses} bg-green-100 text-green-800`;
        case "pending":
          return `${baseClasses} bg-yellow-100 text-yellow-800`;
        case "error":
          return `${baseClasses} bg-red-100 text-red-800`;
        default:
          return `${baseClasses} bg-gray-100 text-gray-800`;
      }
    }
    
    switch (status?.toLowerCase()) {
      case "valid":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "invalid":
        return `${baseClasses} bg-red-100 text-red-800`;
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "not configured":
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  }

  const formatLastChecked = (date) => {
    if (!date) return "Never";
    return new Intl.DateTimeFormat("default", {
      dateStyle: "medium",
      timeStyle: "short"
  }).format(new Date(date))}

  const checkSingleDomain = async (id) => {
    const domain = domains.find(domain => domain._id === id);
    if (!domain) {
      console.error("Domain not found");
      return;
    }

    const hasServer = domain?.server?.serverName;

      setDomains(prev =>
        prev.map(d =>
          d._id === id
            ? {
                ...d,
                cloudflareStatus: "checking",
                ...(hasServer && { serverStatus: "checking" }),
              }
            : d
        )
      );

      try {
        if (hasServer) {
          const [cfResponse, cpResponse] = await Promise.all([
            axios.put(`/api/v1/domain/cloudflare-validity`, { domainId: id }),
            axios.put(`/api/v1/domain/server-validity`, { domainId: id }),
          ]);

          setDomains(prev =>
            prev.map(d =>
              d._id === id
                ? {
                    ...d,
                    cloudflareStatus: cfResponse.data.data.valid ? "valid" : "invalid",
                    serverStatus: cpResponse.data.data.valid ? "valid" : "invalid",
                    lastValidityChecked: new Date().toLocaleString(),
                  }
                : d
            )
          );
        } else {
          const cfResponse = await axios.put(`/api/v1/domain/cloudflare-validity`, { domainId: id });

          setDomains(prev =>
            prev.map(d =>
              d._id === id
                ? {
                    ...d,
                    cloudflareStatus: cfResponse.data.data.valid ? "valid" : "invalid",
                    lastValidityChecked: new Date().toLocaleString(),
                  }
                : d
            )
          );
        }
      } catch (error) {
        console.error("Domain check error:", error);
      }
  };

  const checkAllDomains = async () => {
    setIsCheckingAll(true);

    setDomains(prev =>
      prev.map(d => ({
        ...d,
        cloudflareStatus: "checking",
        ...(d?.server?.serverName && { serverStatus: "checking" }),
      }))
    );

    try {
      const responses = await Promise.all(
        domains.map(async (domain) => {
          const cloudflareCheck = axios.put(`/api/v1/domain/cloudflare-validity`, { domainId: domain._id });

          const serverCheck = domain?.server?.serverName
            ? axios.put(`/api/v1/domain/server-validity`, { domainId: domain._id })
            : null;

          const [cfResponse, cpResponse] = await Promise.all([cloudflareCheck, serverCheck]);

          setDomains(prev =>
            prev.map(d =>
              d._id === domain._id
                ? {
                    ...d,
                    cloudflareStatus: cfResponse.data.data.valid ? "valid" : "invalid",
                    ...(cpResponse && {
                      serverStatus: cpResponse.data.data.valid ? "valid" : "invalid",
                    }),
                    lastValidityChecked: new Date().toLocaleString(),
                  }
                : d
            )
          );
        })
      );

      console.log("All domains checked:", responses);
    } catch (error) {
      console.error("Something went wrong while checking all domains:", error);
    } finally {
      setIsCheckingAll(false);
    }
  };

  const handleCacheClear = async (id)=>{
    try {
      const response = await axios.post(`/api/v1/domain/domain-name/clear-cache-cloudflare`, {domainId:id})
      console.log("cache cleared", response)
      toast.success("Cache cleared successfully")
    } catch (error) {
      console.log("Something went wrong while clearing domain cache" , error)
      toast.error("Something went wrong")
    }
  }

  if (domains.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="text-gray-500 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No domains found</h3>
        <p className="text-gray-500">Get started by creating your first domain or importing existing ones.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Domains ({domains.length})</h3>
        <button
          onClick={checkAllDomains}
          className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Check All Domains
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Domain Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cloudflare Account
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Server
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cloudflare Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CloudPanel Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Checked
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {domains.map((domain) => (
              <tr key={domain._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{domain.domainName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{domain.cloudflareAccount?.accountName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {domain?.server?.serverName || (
                      <span className="text-gray-400 italic">No server</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={getStatusBadge(domain.cloudflareStatus, 'cloudflare')}>
                    {domain.cloudflareStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={getStatusBadge(domain?.serverStatus, 'cloudpanel')}>
                    {domain?.serverStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 flex items-center space-x-2">
                    <span>{formatLastChecked(domain.lastValidityChecked)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => checkSingleDomain(domain._id)}
                      className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={()=>handleDelete(domain._id)}
                      className="text-gray-600 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={()=>handleCacheClear(domain._id)}
                      className="text-gray-600 hover:text-red-600 hover:bg-red-50"
                    >
                      <BrushCleaning className="h-4 w-4" />
                    </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EnhancedDomainsTable;