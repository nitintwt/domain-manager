import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import { Server } from "lucide-react";

// Mock data
const mockServers = [
  {
    id: "1",
    serverName: "Production Server",
    hostName: "prod.company.com",
    sshPort: 22,
    serverLocation: "US East",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    serverName: "Development Server", 
    hostName: "dev.company.com",
    sshPort: 2222,
    serverLocation: "US West",
    createdAt: "2024-02-10",
  },
];

const Servers = () => {
  const [servers] = useState(mockServers);

  const handleDelete = (serverId) => {
    console.log("Delete server:", serverId);
    // Placeholder for delete logic
  };

  if (servers.length === 0) {
    return (
      <div>
        <PageHeader 
          title="Servers"
          description="Manage your remote servers and SSH connections"
          action={
            <Button asChild>
              <Link to="/servers/add">
                <Plus className="mr-2 h-4 w-4" />
                Add Server
              </Link>
            </Button>
          }
        />
        <div className="bg-white rounded-lg border border-gray-200">
          <EmptyState
            icon={<Server className="h-12 w-12" />}
            title="No servers configured"
            description="Get started by adding your first server to manage remote deployments and configurations."
            action={
              <Button asChild>
                <Link to="/servers/add">
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
      <PageHeader 
        title="Servers"
        description="Manage your remote servers and SSH connections"
        action={
          <Button asChild>
            <Link to="/servers/add">
              <Plus className="mr-2 h-4 w-4" />
              Add Server
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
              {servers.map((server) => (
                <tr key={server.id} className="hover:bg-gray-50">
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
                        <Link to={`/servers/edit/${server.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(server.id)}
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
