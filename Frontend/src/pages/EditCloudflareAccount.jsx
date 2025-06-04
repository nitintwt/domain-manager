import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CloudflareAccountForm from "../components/Cloudflare/CloudflareAccountForm";
import {Spinner} from "@heroui/spinner";

// Mock data for editing
const mockAccount = {
  id: "1",
  accountName: "Production Account",
  email: "admin@company.com",
  accountType: "Enterprise",
  apiToken: "cf_token_example_123456789",
  zoneId: "zone_id_example_abcdef",
};

const EditCloudflareAccount = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [account] = useState(mockAccount); // In real app, fetch by ID

  const handleSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Updating Cloudflare account:", { id, ...data });
      
      navigate("/cloudflare");
    } catch (error) {

    } finally {
      setIsLoading(false);
    }
  };

  if (!account) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <h1 
        title="Edit Cloudflare Account"
        description="Update your Cloudflare account configuration"
      />
      <CloudflareAccountForm 
        initialData={account}
        onSubmit={handleSubmit} 
        isLoading={isLoading} 
      />
    </div>
  );
};

export default EditCloudflareAccount;
