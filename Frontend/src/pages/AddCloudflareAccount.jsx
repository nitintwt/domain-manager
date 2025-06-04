import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CloudflareAccountForm from "@/components/cloudflare/CloudflareAccountForm";
import PageHeader from "@/components/ui/PageHeader";
import { toast } from "@/hooks/use-toast";

const AddCloudflareAccount = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Adding Cloudflare account:", data);
      
      toast({
        title: "Account added successfully",
        description: "Your Cloudflare account has been added to the dashboard.",
      });
      
      navigate("/cloudflare");
    } catch (error) {
      toast({
        title: "Error adding account",
        description: "There was an error adding your Cloudflare account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <PageHeader 
        title="Add Cloudflare Account"
        description="Add a new Cloudflare account to your dashboard"
      />
      <CloudflareAccountForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default AddCloudflareAccount;
