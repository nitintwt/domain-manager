import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CloudflareAccountForm from "../components/Cloudflare/CloudflareAccountForm";


const AddCloudflareAccount = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Adding Cloudflare account:", data);
      
      navigate("/cloudflare");
    } catch (error) {

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 
        title="Add Cloudflare Account"
        description="Add a new Cloudflare account to your dashboard"
      />
      <CloudflareAccountForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default AddCloudflareAccount;
