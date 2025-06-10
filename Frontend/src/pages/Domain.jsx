import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Textarea } from "@heroui/input";
import { Badge } from "@heroui/badge";
import { Check, X, RefreshCw, Globe, RotateCw, Axis3D , Trash2} from "lucide-react";
import axios from 'axios'
import { useCookies } from 'react-cookie';
import { Toaster, toast } from 'sonner';
import { toastRegion } from "@heroui/theme";

const CustomSelectAccount = ({ label, value, onChange, cloudflares }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Select {label}</option>
      {cloudflares?.map(opt => (
        <option key={opt._id} value={opt._id}>{opt.accountName}</option>
      ))}
    </select>
  </div>
);

const CustomSelectServer = ({ label, value, onChange, servers }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Select {label}</option>
      {servers?.map(opt => (
        <option key={opt._id} value={opt._id}>{opt.serverName}</option>
      ))}
    </select>
  </div>
);

const Domain = () => {
  const [domainInput, setDomainInput] = useState("");
  const [domains, setDomains] = useState([]);
  const [isCheckingAll, setIsCheckingAll] = useState(false);
  const [cloudflareAccount , setCloudflareAccount]= useState()
  const [cloudPanelServer , setCloudPanelServer]= useState()
  const [cloudflareAccounts , setCloduflareAccounts]= useState([])
  const [cloudPanelServers , setCloudPanelServers]= useState([])
  const [cookies, setCookies] = useCookies();

  const fetchDomains = async () => {
  try {
    const response = await axios.get(`/api/v1/domain/domain-names?userId=${cookies.userData?._id}`);
    setDomains(response.data.data);
  } catch (error) {
    console.log("Something went wrong while fetching domains", error);
    toast.error("Failed to fetch domains.");
  };}

  const addDomain = async ()=>{
    if (!cloudflareAccount || !cloudPanelServer) {
      toast.warning("Please select both Cloudflare Account and Cloudpanel Server.")
      return;
    }
    const lines = domainInput
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const uniqueDomains = [...new Set(lines)];
    console.log("domains", uniqueDomains)
    try {
      const response = await axios.post(`/api/v1/domain/domain-name`, {
        userId:cookies.userData._id,
        domains:uniqueDomains,
        cloudflareAccountId:cloudflareAccount,
        serverId:cloudPanelServer
      })
      setDomainInput('')
      setCloudflareAccount('')
      setCloudPanelServer('')
      toast.success("Domain added successfully")
      fetchDomains();
    } catch (error) {
      console.log('Something went wrong while creating domains' , error)
    }
  }

  const checkSingleDomain = async (id) => {
      setDomains(prev => prev.map(d =>
      d._id === id
        ? { ...d, isCloudflareValid: "checking", isCloudpanelValid: "checking" }
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
          isCloudpanelValid: cpResponse.data.data.valid,
          isCloudflareValid: cfResponse.data.data.valid,
          lastChecked: new Date()
        }
        : d
    ));
    } catch (error) {
    console.error("Domain check error:", error);

    }
  };

  const checkAllDomains = async () => {
    setIsCheckingAll(true);
    setDomains(prev => prev.map(d => ({
      ...d,isCloudflareValid: "checking", isCloudpanelValid: "checking"
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
          isCloudpanelValid: cpResponse.data.data.valid,
          isCloudflareValid: cfResponse.data.data.valid,
          lastChecked: new Date()
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

const getStatusBadge = (isVerified) => {
  if (isVerified === "checking") {
    return (
      <div className="flex items-center gap-2">
        {getStatusIcon("checking")}
        <Badge className="px-3 py-1 text-sm text-blue-800">
          Checking
        </Badge>
      </div>
    );
  }

  // Handle not checked state
  if (isVerified === undefined || isVerified === null) {
    return (
      <div className="flex items-center gap-2">
        {getStatusIcon("unchecked")}
        <Badge className="rounded-full px-3 py-1 text-sm bg-gray-100 text-gray-800">
          Not Checked
        </Badge>
      </div>
    );
  }

  // Handle checked state (valid/invalid)
  const status = isVerified ? "Valid" : "Invalid";
  const variant = isVerified 
    ? "text-green-800" 
    : "text-red-800";

  return (
    <div className="flex items-center gap-2">
      {getStatusIcon(status)}
      <Badge className={`rounded-full px-3 py-1 text-sm ${variant}`}>
        {status}
      </Badge>
    </div>
  );
};

  const getStatusIcon = (status) => {
    switch (status) {
      case "Valid":
        return <Check className="h-4 w-4 text-green-600" />;
      case "Invalid":
        return <X className="h-4 w-4 text-red-600" />;
      case "checking":
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      default:
        return <span className="h-4 w-4 bg-gray-300 rounded-full inline-block" />;
    }
  };

  const formatLastChecked = (date) => {
    if (!date) return "Never";
    return new Intl.DateTimeFormat("default", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(new Date(date));
  };

  useEffect(()=>{
    const fetchCloudflareAccounts = async ()=>{
      try {
        const response = await axios.get(`/api/v1/cloudflare/cloudflare-accounts?userId=${cookies.userData?._id}`)
        console.log("response" , response)
        setCloduflareAccounts(response.data.data)
      } catch (error) {
        console.log("Something went wrong while fetching cloudflare accounts ", error)
      }
    }

    const fetchCloudPanelServer = async () =>{
      try {
        const response = await axios.get(`/api/v1/server/server-credentials?userId=${cookies.userData?._id}`)
        setCloudPanelServers(response.data.data)
        console.log("response" , response)
      } catch (error) {
        console.log("Something went wrong while fetching cloudpanel server ", error)
      }

    }
    fetchDomains()
    fetchCloudPanelServer()
    fetchCloudflareAccounts()
  
  },[])

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

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader className="flex items-center gap-2 text-xl font-semibold">
          <Globe className="w-5 h-5" /> Domain
        </CardHeader>
        <div className="flex gap-4 mb-2">
        <CustomSelectAccount
          label="Cloudflare Account"
          value={cloudflareAccount}
          onChange={setCloudflareAccount}
          cloudflares={cloudflareAccounts}
        />
        <CustomSelectServer
          label="Cloudpanel Server"
          value={cloudPanelServer}
          onChange={setCloudPanelServer}
          servers={cloudPanelServers}
        />
      </div>
        <CardBody className="space-y-4">
          <Textarea
            minRows={3}
            placeholder="Enter domains (one per line)"
            value={domainInput}
            onChange={(e) => setDomainInput(e.target.value)}
          />
          <Button onClick={addDomain} className="bg-blue-600 text-white hover:bg-blue-700 p-2 rounded-xl" >Parse Domains</Button>
        </CardBody>
      </Card>
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Domains</h2>
          <Button variant="ghost" className="bg-blue-600 text-white hover:bg-blue-700 p-2 rounded-xl" onClick={checkAllDomains} disabled={isCheckingAll}>
            <RotateCw className="w-4 h-4" /> Check All Domains
          </Button>
        </CardHeader>
        <CardBody className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domain Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CloudPanel Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cloudflare Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Checked</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {domains.map((domain) => (
                <tr key={domain._id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">{domain.domainName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(domain.isCloudpanelValid)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(domain.isCloudflareValid)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatLastChecked(domain.lastValidityChecked)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => checkSingleDomain(domain._id)}
                      className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    >
                      <RotateCw className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={()=>handleDelete(domain._id)}
                      className="text-gray-600 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
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
  }

export default Domain;
