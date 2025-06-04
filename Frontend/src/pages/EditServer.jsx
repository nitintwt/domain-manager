import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ServerForm from "@/components/servers/ServerForm";
import PageHeader from "@/components/ui/PageHeader";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { toast } from "@/hooks/use-toast";

// Mock data for editing
const mockServer = {
  id: "1",
  serverName: "Production Server",
  hostName: "prod.company.com",
  sshPort: 22,
  serverLocation: "US East",
  sshUsername: "root",
  sshKey: "-----BEGIN OPENSSH PRIVATE KEY-----\nExample private key content\n-----END OPENSSH PRIVATE KEY-----",
  sshPassword: "",
};

const EditServer = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [server] = useState(mockServer); // In real app, fetch by ID

  const handleSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Updating server:", { id, ...data });
      
      toast({
        title: "Server updated successfully",
        description: "Your server configuration has been updated.",
      });
      
      navigate("/servers");
    } catch (error) {
      toast({
        title: "Error updating server",
        description: "There was an error updating your server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!server) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader 
        title="Edit Server"
        description="Update your server configuration"
      />
      <ServerForm 
        initialData={server}
        onSubmit={handleSubmit} 
        isLoading={isLoading} 
      />
    </div>
  );
};

export default EditServer;
