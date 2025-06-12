import { useEffect, useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import { Button } from "@heroui/button";
import CreateDomainModal from "../components/Domains/CreateDomainModal";
import ImportDomainsModal from "../components/Domains/ImportDomainsModal";
import DomainsTable from "../components/Domains/DomainsTable";
import { Toaster, toast } from 'sonner';
import axios from 'axios'
import { useCookies } from 'react-cookie';


const Domains = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isCheckingAll, setIsCheckingAll] = useState(false);
  const [cookies, setCookies] = useCookies();
  const [domains, setDomains] = useState([]);

  const fetchDomains = async () => {
    try {
      const response = await axios.get(`/api/v1/domain/domain-names?userId=${cookies.userData?._id}`);
      setDomains(response.data.data);
    } catch (error) {
      console.log("Something went wrong while fetching domains", error);
      toast.error("Failed to fetch domains.");
    }
  }

  const checkSingleDomain = async (id) => {
    setDomains(prev => prev.map(d =>
      d._id === id
        ? { ...d, cloudflareStatus: "checking", serverStatus: "checking" }
        : d
    ));
    try {
      const [cfResponse, cpResponse] = await Promise.all([
        axios.put(`/api/v1/domain/cloudflare-validity`, { domainId: id }),
        axios.put(`/api/v1/domain/server-validity`, { domainId: id })
      ]);

      setDomains(prev => prev.map(d =>
        d._id === id
          ? {
            ...d,
            serverStatus: cpResponse.data.data.valid ? "valid" : "invalid",
            cloudflareStatus: cfResponse.data.data.valid ? "valid" : "invalid",
            lastValidityChecked: new Date().toLocaleString()
          }
          : d
      ));
    } catch (error) {
       console.error("Domain check error:", error);
      }
  }

  const checkAllDomains = async () => {
    setIsCheckingAll(true);
    setDomains(prev => prev.map(d => ({
      ...d,cloudflareStatus: "checking",serverStatus: "checking"
    })));

    try {
      const reponse = await Promise.all( domains.map(async (domain)=>{
        const [cfResponse, cpResponse] = await Promise.all([
          axios.put(`/api/v1/domain/cloudflare-validity`, { domainId: domain._id }),
          axios.put(`/api/v1/domain/server-validity`, { domainId: domain._id })
        ]);

        setDomains(prev => prev.map(d =>
          d._id === domain._id
            ? {
              ...d,
              serverStatus: cpResponse.data.data.valid ? "valid" : "invalid",
              cloudflareStatus: cfResponse.data.data.valid ? "valid" : "invalid",
              lastValidityChecked: new Date().toLocaleString()
            }
            : d
          )
        );
      }))
      console.log("all domains" , reponse)
    } catch (error) {
      console.log("Something went wrong while checking all domains")
    } finally{
      setIsCheckingAll(false)
    }
  };

  const handleDelete = async (id)=>{
    try {
      await axios.delete(`/api/v1/domain/domain-name/${id}`)
      toast.success("Domain deleted successfully")
      fetchDomains()
    } catch (error) {
      console.log("Something went worng while deleting your domain")
      toast.error("Something went wrong")
    }
  }

  useEffect(()=>{
    fetchDomains()
  },[])

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
        checkSingleDomain={checkSingleDomain}
        checkAllDomains={checkAllDomains}
        handleDelete={handleDelete}
      />

      <CreateDomainModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        fetchDomains={fetchDomains}
        
      />

      <ImportDomainsModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        fetchDomains={fetchDomains}
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