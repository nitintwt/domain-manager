
import { useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import { Button } from "@heroui/button";
import CreateDomainModal from "../components/Domains/CreateDomainModal";
import ImportDomainsModal from "../components/Domains/ImportDomainsModal";
import DomainsTable from "../components/Domains/DomainsTable";
import { Toaster, toast } from 'sonner';


// Enhanced mock data for domains with status information
const mockDomains = [
  {
    id: 1,
    domainName: "example.com",
    cloudflareAccount: "Main Account",
    server: "Production Server",
    status: "Active",
    cloudflareStatus: "Valid",
    cloudpanelStatus: "Valid",
    lastChecked: "2024-01-15 10:30:00",
    createdAt: "2024-01-15"
  },
  {
    id: 2,
    domainName: "test.com",
    cloudflareAccount: "Dev Account",
    server: null,
    status: "Active",
    cloudflareStatus: "Valid",
    cloudpanelStatus: "Not Configured",
    lastChecked: "2024-01-20 09:15:00",
    createdAt: "2024-01-20"
  },
  {
    id: 3,
    domainName: "staging.app",
    cloudflareAccount: "Main Account",
    server: "Staging Server",
    status: "Pending",
    cloudflareStatus: "Invalid",
    cloudpanelStatus: "Valid",
    lastChecked: "2024-02-01 14:45:00",
    createdAt: "2024-02-01"
  }
];

const Domains = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [domains, setDomains] = useState(mockDomains);

  const handleCreateDomain = (domainData) => {
    const newDomain = {
      id: domains.length + 1,
      domainName: domainData.domainName,
      cloudflareAccount: domainData.cloudflareAccount,
      server: domainData.server || null,
      status: "Pending",
      cloudflareStatus: "Pending",
      cloudpanelStatus: domainData.server ? "Pending" : "Not Configured",
      lastChecked: new Date().toISOString().replace('T', ' ').split('.')[0],
      createdAt: new Date().toISOString().split('T')[0]
    };
    setDomains([...domains, newDomain]);
    setIsCreateModalOpen(false);
  };

  const handleImportDomains = (importData) => {
    const newDomains = importData.domains.map((domain, index) => ({
      id: domains.length + index + 1,
      domainName: domain,
      cloudflareAccount: importData.cloudflareAccount,
      server: importData.server || null,
      status: "Pending",
      cloudflareStatus: "Pending",
      cloudpanelStatus: importData.server ? "Pending" : "Not Configured",
      lastChecked: new Date().toISOString().replace('T', ' ').split('.')[0],
      createdAt: new Date().toISOString().split('T')[0]
    }));
    setDomains([...domains, ...newDomains]);
    setIsImportModalOpen(false);
  };

  const handleDomainAction = (domainId, action) => {
    console.log(`${action} action for domain ${domainId}`);
    // Placeholder for domain actions
  };

  const handleCheckDomain = (domainId) => {
    console.log(`Checking domain ${domainId}`);
    // Placeholder for status check
  };

  const handleCheckAllDomains = () => {
    console.log("Checking all domains");
    // Placeholder for bulk status check
  };

  return (
    <div>
      <PageHeader
        title="Domains"
        description="Manage your domains across Cloudflare and servers"
        action={
          <div className="flex space-x-3">
            <Button 
              className="bg-blue-600 text-white hover:bg-blue-700 rounded-xl"
              onClick={() => setIsImportModalOpen(true)}
            >
              Import Domains
            </Button>
            <Button  onClick={() => setIsCreateModalOpen(true)}>
              Create Domain
            </Button>
          </div>
        }
      />

      <DomainsTable 
        domains={domains} 
        onAction={handleDomainAction}
        onCheckDomain={handleCheckDomain}
        onCheckAllDomains={handleCheckAllDomains}
      />

      <CreateDomainModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateDomain}
      />

      <ImportDomainsModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSubmit={handleImportDomains}
      />
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#fff',
            color: '#333',
            border: '1px solid #e2e8f0',
            borderRadius: '0.5rem',
          },
          duration: 2000,
        }}
      />
    </div>
  );
};

export default Domains;