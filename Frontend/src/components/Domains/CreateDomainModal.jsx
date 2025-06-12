import { useState , useEffect } from "react";
import CustomModal from "../ui/CustomModal";
import CustomDropdown from "../ui/CustomDropdown";
import {useCookies} from 'react-cookie'
import axios from 'axios'
import { Toaster, toast } from 'sonner';

const CreateDomainModal = ({ isOpen, onClose, fetchDomains }) => {
  const [domain , setDomain]= useState()
  const [cloudflareAccount , setCloudflareAccount]= useState()
  const [cloudPanelServer , setCloudPanelServer]=useState()
  const [cloudflareAccounts , setCloudflareAccounts]= useState([])
  const [cloudPanelServers , setCloudPanelServers]= useState([])
  const [cookies , setCookies]=useCookies()
  const [isServer , setIsServer]=useState(false)


  const handleClose = () => {
    setCloudPanelServer('')
    setCloudflareAccount('')
    setDomain('')
    setIsServer(false)
    onClose();
  };

  const handleCreate = async () => {
    try {
      const domainData = {
        domainName:domain,
        cloudflareAccount:cloudflareAccount,
        owner: cookies.userData._id
      }
      if (isServer && cloudPanelServer) {
        requestData.serverId = cloudPanelServer;
      }
      const response = await axios.post(`/api/v1/domain/domain-name`,domainData)
      console.log("created" , response)
      toast.success("Domain created successfully")
    } catch (error) {
      toast.wrong("Something went wrong while creating your server")
      console.log("Something went wrong while creating your server", error)
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


  return (
    <CustomModal isOpen={isOpen} onClose={handleClose} title="Create Domain">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Domain Name
          </label>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

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
              Create domain in CloudPanel server
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

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleCreate}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

export default CreateDomainModal;