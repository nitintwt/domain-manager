import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ServerForm from "@/components/servers/ServerForm";
import PageHeader from "@/components/ui/PageHeader";
import { toast } from "@/hooks/use-toast";

const AddServer = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Adding server:", data);
      
      toast({
        title: "Server added successfully",
        description: "Your server has been added to the dashboard.",
      });
      
      navigate("/servers");
    } catch (error) {
      toast({
        title: "Error adding server",
        description: "There was an error adding your server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <PageHeader 
        title="Add Server"
        description="Add a new server to your dashboard for remote management"
      />
      <ServerForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default AddServer;
