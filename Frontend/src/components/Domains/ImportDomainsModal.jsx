import { useState , useEffect } from "react";
import CustomModal from "../ui/CustomModal";
import CustomDropdown from "../ui/CustomDropdown";
import {useCookies} from 'react-cookie'
import axios from 'axios'
import { Toaster, toast } from 'sonner';

const ImportDomainsModal = ({ isOpen, onClose, fetchDomains }) => {
  const [domains , setDomains]= useState('')
  const [cloudflareAccount , setCloudflareAccount]= useState()
  const [cloudPanelServer , setCloudPanelServer]=useState()
  const [cloudflareAccounts , setCloudflareAccounts]= useState([])
  const [cloudPanelServers , setCloudPanelServers]= useState([])
  const [cookies , setCookies]=useCookies()
  const [isServer , setIsServer]=useState(false)


  const importDomains = async ()=>{
    if (!cloudflareAccount || !domains) {
      toast.warning("Please select both Cloudflare Account and Cloudpanel Server.")
      return;
    }
    const lines = domains
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const uniqueDomains = [...new Set(lines)];
    console.log("domains", uniqueDomains)
    try {
      const requestData = {
        userId: cookies.userData._id,
        domains: uniqueDomains,
        cloudflareAccountId: cloudflareAccount,
      };

      if (isServer && cloudPanelServer) {
        requestData.serverId = cloudPanelServer;
      }

      const response = await axios.post(`/api/v1/domain/domain-name`, requestData);
      console.log('imported' , response)
      onClose()
      fetchDomains()
      setDomains('')
      setCloudflareAccount('')
      setCloudPanelServer('')
      toast.success("Domain imported successfully")
    } catch (error) {
      toast.error("Something went wrong while importing your domains")
      console.log('Something went wrong while importing your domains' , error)
    }
  }

  useEffect(()=>{
    const fetchCloudflareAccounts = async ()=>{
      try {
        const response = await axios.get(`/api/v1/cloudflare/cloudflare-accounts?userId=${cookies.userData?._id}`)
        console.log("response" , response)
        setCloudflareAccounts(response.data.data)
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
    fetchCloudPanelServer()
    fetchCloudflareAccounts()
  },[])

  const handleClose = () => {
    setCloudPanelServer('')
    setCloudflareAccount('')
    setDomains('')
    setIsServer(false)
    onClose();
  };

  return (
    <CustomModal isOpen={isOpen} onClose={handleClose} title="Import Existing Domains">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Domain Names (one per line)
          </label>
          <textarea
            value={domains}
            onChange={(e) => setDomains(e.target.value)}
            placeholder="example.com&#10;mydomain.net&#10;another-site.org"
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter each domain on a new line. Only valid domains will be imported.
          </p>
        </div>
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cloudflare Account
              </label>
              <CustomDropdown
                options={cloudflareAccounts}
                value={cloudflareAccount}
                onChange={(value) => setCloudflareAccount(value) }
                placeholder="Select Cloudflare Account"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  onChange={(e) => setIsServer(!isServer)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  CloudPanel server
                </span>
              </label>
            </div>

            {isServer && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Server
                </label>
                <CustomDropdown
                  options={cloudPanelServers}
                  value={cloudPanelServer}
                  onChange={(value) => setCloudPanelServer(value)}
                  placeholder="Select Server"
                />
              </div>
            )}
          </>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
          onClick={importDomains}
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Import Domains
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

export default ImportDomainsModal;
