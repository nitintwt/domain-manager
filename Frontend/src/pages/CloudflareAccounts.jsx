import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, TestTube } from "lucide-react";
import {Button, ButtonGroup} from "@heroui/button";;
import StatusBadge from "../components/ui/StatusBadge";
import EmptyState from "../components/ui/EmptyState";
import TestCredentialsModal from "../components/Cloudflare/TestCredentialsModal";
import { Cloud } from "lucide-react";

// Mock data
const mockAccounts = [
  {
    id: "1",
    accountName: "Production Account",
    email: "admin@company.com",
    accountType: "Enterprise",
    createdAt: "2024-01-15",
  },
  {
    id: "2", 
    accountName: "Development Account",
    email: "dev@company.com",
    accountType: "Pro",
    createdAt: "2024-02-10",
  },
];

const CloudflareAccounts = () => {
  const [accounts] = useState(mockAccounts);
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const handleTestCredentials = (accountId) => {
    setSelectedAccount(accountId);
    setTestModalOpen(true);
  };

  const handleDelete = (accountId) => {
    console.log("Delete account:", accountId);
    // Placeholder for delete logic
  };

  if (accounts.length === 0) {
    return (
      <div>
        <PageHeader 
          title="Cloudflare Accounts"
          description="Manage your Cloudflare accounts and API credentials"
          action={
            <Button asChild>
              <Link to="/cloudflare/add">
                <Plus className="mr-2 h-4 w-4" />
                Add Account
              </Link>
            </Button>
          }
        />
        <div className="bg-white rounded-lg border border-gray-200">
          <EmptyState
            icon={<Cloud className="h-12 w-12" />}
            title="No Cloudflare accounts"
            description="Get started by adding your first Cloudflare account to manage your DNS and security settings."
            action={
              <Button asChild>
                <Link to="/cloudflare/add">
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
    <div>
      <h1 
        title="Cloudflare Accounts"
        description="Manage your Cloudflare accounts and API credentials"
        action={
          <Button asChild>
            <Link to="/cloudflare/add">
              <Plus className="mr-2 h-4 w-4" />
              Add Account
            </Link>
          </Button>
        }
      />

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
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
              {accounts.map((account) => (
                <tr key={account.id} className="hover:bg-gray-50">
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
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTestCredentials(account.id)}
                      >
                        <TestTube className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/cloudflare/edit/${account.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(account.id)}
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

      <TestCredentialsModal
        open={testModalOpen}
        onClose={() => setTestModalOpen(false)}
        accountId={selectedAccount}
      />
    </div>
  );
};

export default CloudflareAccounts;
