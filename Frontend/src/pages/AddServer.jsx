import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ServerForm from "../components/Server/ServerForm"

const AddServer = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Adding server:", data);
      
      
      navigate("/servers");
    } catch (error) {

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
