import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, TestTube, Cloud } from "lucide-react";
import { Button, ButtonGroup } from "@heroui/button";
import StatusBadge from "../components/ui/StatusBadge";
import EmptyState from "../components/ui/EmptyState";
import TestCredentialsModal from "../components/Cloudflare/TestCredentialsModal";
import axios from "axios";
import { useCookies } from 'react-cookie';

const CloudflareAccounts = () => {
  const [accounts , setAccounts] = useState();
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [cookies] = useCookies();

  const handleTestCredentials = (accountId) => {
    setSelectedAccount(accountId);
    setTestModalOpen(true);
  };

  const fetchAccounts = async ()=>{
    try {
      const response = await axios.get(`/api/v1/cloudflare/cloudflare-accounts?userId=${cookies.userData?._id}`)
      setAccounts(response.data.data)
      console.log("accounts" , response)
    } catch (error) {
      console.log("Something went wrong while fetching accounts")
    }
  }

  const handleDelete = async (accountId) => {
    try {
      const ress = await axios.delete(`/api/v1/cloudflare/cloudflare-accounts/${accountId}`)
      console.log("deleted" , ress)
      fetchAccounts()
    } catch (error) {
      console.log("Something went wrong while deleting your", error)
    }
  };

  useEffect(()=>{
    fetchAccounts()
  }, [])

  const Header = () => (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex items-center space-x-4">
      </div>
      <Button 
        asChild 
        className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 shadow-sm rounded-md"
      >
        <Link to="/cloudflare/add" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Account
        </Link>
      </Button>
    </div>
  );

  if (accounts?.length === 0) {
    return (
      <div className="p-6 space-y-6">
        <Header />
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <EmptyState
            icon={<Cloud className="h-12 w-12 text-blue-600" />}
            title="No Cloudflare accounts"
            description="Get started by adding your first Cloudflare account to manage your DNS and security settings."
            action={
              <Button asChild className="bg-blue-600 text-white hover:bg-blue-700">
                <Link to="/cloudflare/add" className="flex items-center">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Account
                </Link>
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Header />

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
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
              {accounts?.map((account) => (
                <tr key={account._id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{account.accountName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {account.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={account.accountType === "Enterprise" ? "success" : "warning"}>
                      {account.accountType}
                    </StatusBadge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(account.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <ButtonGroup>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTestCredentials(account._id)}
                        className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                      >
                        <TestTube className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        asChild
                        className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                      >
                        <Link to={`/cloudflare/edit/${account._id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(account._id)}
                        className="text-gray-600 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </ButtonGroup>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <TestCredentialsModal
        open={testModalOpen}
        onClose={() => setTestModalOpen(false)}
        accountId={selectedAccount}
      />
    </div>
  );
};

export default CloudflareAccounts;