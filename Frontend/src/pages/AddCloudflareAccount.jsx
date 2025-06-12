import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CloudflareAccountForm from "../components/Cloudflare/CloudflareAccountForm";
import axios from 'axios'
import { useCookies } from 'react-cookie';

const AddCloudflareAccount = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [cookies] = useCookies();


  const handleSubmit = async (data) => {
    setIsLoading(true);
    try {
      const addData = await axios.post(`/api/v1/cloudflare/cloudflare-accounts`, {
        userId:cookies.userData?._id,
        accountName:data.accountName,
        email:data.email,
        accountType:data.accountType,
        apiKey:data.apiToken,
        zoneId:data.zoneId
      })
      console.log("Adding Cloudflare account:", addData);
      navigate("/cloudflare");
    } catch (error) {
      console.log("Something went wrong while adding cloduflare account" , error)
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
