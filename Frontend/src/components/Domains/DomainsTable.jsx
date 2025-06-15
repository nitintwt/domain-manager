import { useState } from "react";
import { Trash2, RefreshCcw } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import ActionsDropdown from "../ui/ActionsDropdown";
import CustomModal from "../ui/CustomModal";

const EnhancedDomainsTable = ({ domains, setDomains, handleDelete, setIsCheckingAll }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState(null);

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

  const handleAction = (action, domainId) => {
    switch (action) {
      case "recheck":
        checkSingleDomain(domainId);
        break;
      case "cacheClear":
        handleCacheClear(domainId)
        break
      case "deleteDB":
        handleDelete(domainId);
        break;
      case "deleteCloudflare":
        setModalAction("cloudflare");
        setSelectedDomain(domainId);
        setIsModalOpen(true);
        break;
      case "deleteCloudPanel":
        setModalAction("cloudpanel");
        setSelectedDomain(domainId);
        setIsModalOpen(true);
        break;
      default:
        console.error("Unknown action:", action);
    }
  };

  const formatLastChecked = (date) => {
    if (!date) return "Never";
    return new Intl.DateTimeFormat("default", {
      dateStyle: "medium",
      timeStyle: "short"
  }).format(new Date(date))}

  const handleModalConfirm = async () => {
    try {
      if (modalAction === "cloudflare") {
        await axios.delete(`/api/v1/domain/cloudflare/${selectedDomain}`);
        toast.success("Domain deleted from Cloudflare successfully");
      } else if (modalAction === "cloudpanel") {
        toast.warning("Deleting domain.....")
        const res = await axios.delete(`/api/v1/domain/domain-name/delete-domain-server/${selectedDomain}`);
        console.log("del server ", res)
        toast.success("Domain deleted from CloudPanel Server successfully");
      }
    } catch (error) {
      console.error(`Error deleting domain from ${modalAction}:`, error);
      toast.error(`Failed to delete domain from ${modalAction}`);
    } finally {
      setIsModalOpen(false);
      setModalAction(null);
      setSelectedDomain(null);
    }
  };

  const checkSingleDomain = async (id) => {
    const domain = domains.find((domain) => domain._id === id);
    if (!domain) {
      console.error("Domain not found");
      return;
    }

    const hasServer = domain?.server?.serverName;

    setDomains((prev) =>
      prev.map((d) =>
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

        setDomains((prev) =>
          prev.map((d) =>
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

        setDomains((prev) =>
          prev.map((d) =>
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

  const dropdownOptions = [
    { _id: "recheck", label: "Recheck", icon: <RefreshCcw className="w-5 h-5 mr-2" /> },
    { _id: "deleteDB", label: "Delete from DB", icon: <Trash2 className="w-5 h-5 mr-2" /> },
    { _id: "cacheClear", label: "Clear Domain Cache", icon: <Trash2 className="w-5 h-5 mr-2" /> },
    { _id: "deleteCloudflare", label: "Delete from Cloudflare", icon: <Trash2 className="w-5 h-5 mr-2 text-red-500" />, color: "text-red-500" },
    { _id: "deleteCloudPanel", label: "Delete from CloudPanel", icon: <Trash2 className="w-5 h-5 mr-2 text-red-500" />, color: "text-red-500" },
  ];

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
                    {domain?.server?.serverName || <span className="text-gray-400 italic">No server</span>}
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
                  <ActionsDropdown options={dropdownOptions} onSelect={(action) => handleAction(action, domain._id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CustomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Confirm Delete from ${modalAction === "cloudflare" ? "Cloudflare" : "CloudPanel"}`}
      >
        <p className="text-gray-600">
          Are you sure you want to delete this domain from {modalAction === "cloudflare" ? "Cloudflare" : "CloudPanel"}?
        </p>
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleModalConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Confirm
          </button>
        </div>
      </CustomModal>
    </div>
  );
};

export default EnhancedDomainsTable;