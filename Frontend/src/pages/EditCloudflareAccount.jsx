import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CloudflareAccountForm from "../components/Cloudflare/CloudflareAccountForm";
import {Spinner} from "@heroui/spinner";
import axios from "axios";
import { useCookies } from 'react-cookie';

const EditCloudflareAccount = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [account, setAccount] = useState();
  const [cookies] = useCookies();

  const handleSubmit = async (data) => {
    setIsLoading(true);
    try {
      const updateData = await axios.put(`/api/v1/cloudflare/cloudflare-accounts/${id}`, {
        userId:cookies.userData?._id,
        accountName:data.accountName,
        email:data.email,
        accountType:data.accountType,
        apiToken:data.apiToken,
        zoneId:data.zoneId
      })
      console.log("updated dta" , updateData)
      navigate("/cloudflare");
    } catch (error) {
      console.log("Something went wrong while updating your account data" , error)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(()=>{
    const fetchAccount = async ()=>{
      try {
        const accountData = await axios.get(`/api/v1/cloudflare/cloudflare-account/${id}`)
        setAccount(accountData.data.data)
        console.log("data" ,accountData)
      } catch (error) {
        console.log("Something went wrong while fetching accounts data " , error)
      }
    }
    fetchAccount()
  },[])

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
