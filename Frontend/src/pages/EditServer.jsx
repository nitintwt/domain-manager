import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ServerForm from "../components/Server/ServerForm";
import {Spinner} from "@heroui/spinner";
import axios from 'axios'
import { useCookies } from 'react-cookie';

const EditServer = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [server , setServer] = useState();
  const [cookies] = useCookies();

  const handleSubmit = async (data) => {
    setIsLoading(true);
    try {
      const updateData = await axios.put(`/api/v1/server/server-credentials/${id}`, {
        userId:cookies.userData?._id,
        serverName:data.serverName,
        hostName:data.hostName,
        sshPort:data.sshPort,
        serverLocation:data.serverLocation,
        sshUsername:data.sshUsername,
        sshPassword:data.sshPassword
      })
      console.log("updated dta" , updateData)
      navigate("/servers");
    } catch (error) {
      console.log("Something went wrong while updating your account data" , error)
    } finally {
      setIsLoading(false);
    }
  };

    useEffect(()=>{
    const fetchAccount = async ()=>{
      try {
        const accountData = await axios.get(`/api/v1/server/server-credential/${id}`)
        setServer(accountData.data.data)
        console.log("data" ,accountData)
      } catch (error) {
        console.log("Something went wrong while fetching accounts data " , error)
      }
    }
    fetchAccount()
  },[])

  if (!server) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <h1 
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
