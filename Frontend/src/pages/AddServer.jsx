import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ServerForm from "../components/Server/ServerForm"
import axios from 'axios'
import { useCookies } from 'react-cookie';

const AddServer = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [cookies] = useCookies();

  const handleSubmit = async (data) => {
    setIsLoading(true);
    try {
      const addData = await axios.post(`/api/v1/server/server-credentials`, {
        userId:cookies.userData?._id,
        serverName:data.serverName,
        hostName:data.hostName,
        sshPort:data.sshPort,
        serverLocation:data.serverLocation,
        sshUsername:data.sshUsername,
        sshPassword:data.sshPassword
      })
      console.log("Adding Server:", addData);
      navigate("/cloudflare");
    } catch (error) {
      console.log("Something went wrong while adding Server" , error)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 
        title="Add Server"
        description="Add a new server to your dashboard for remote management"
      />
      <ServerForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default AddServer;
