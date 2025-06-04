
import { Navigate } from "react-router-dom";

const Index = () => {
  // Redirect to Cloudflare accounts as the default page
  return <Navigate to="/cloudflare" replace />;
};

export default Index;