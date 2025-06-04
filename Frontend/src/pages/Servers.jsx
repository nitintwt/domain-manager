import { useState , useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2 } from "lucide-react";
import {Button, ButtonGroup} from "@heroui/button";;
import EmptyState from "../components/ui/EmptyState";
import { Server } from "lucide-react";
import axios from "axios";
import { useCookies } from 'react-cookie';

const Servers = () => {
  const [servers , setServers] = useState();
  const [cookies] = useCookies();

  const handleDelete = async (accountId) => {
    try {
      const ress = await axios.delete(`/api/v1/server/server-credentials/${accountId}`)
      console.log("deleted" , ress)
    } catch (error) {
      console.log("Something went wrong while deleting your", error)
    }
  };

  useEffect(()=>{
    const fetchServers = async ()=>{
      try {
        const response = await axios.get(`/api/v1/server/server-credentials?userId=${cookies.userData?._id}`)
        setServers(response.data.data)
        console.log("accounts" , response)
      } catch (error) {
        console.log("Something went wrong while fetching Servers" , error)
      }
    }
    fetchServers()
  }, [])

    const Header = () => (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex items-center space-x-4">

      </div>
      <Button 
        asChild 
        className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 shadow-sm rounded-md"
      >
        <Link to="/servers/add" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Server
        </Link>
      </Button>
    </div>
  );

  if (servers?.length === 0) {
    return (
      <div className="p-6 space-y-6">
        <Header />
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <EmptyState
            icon={<Server className="h-12 w-12 text-blue-600" />}
            title="No servers configured"
            description="Get started by adding your first server to manage remote deployments and configurations."
            action={
              <Button asChild className="bg-blue-600 text-white hover:bg-blue-700">
                <Link to="/servers/add" className="flex items-center">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Server
                </Link>
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div>
    <div className="p-6 space-y-6">
      <Header />
    </div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Server
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Host
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SSH Port
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {servers?.map((server) => (
                <tr key={server._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{server.serverName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {server.hostName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {server.sshPort}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {server.serverLocation}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(server.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/servers/edit/${server._id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(server._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Servers;
