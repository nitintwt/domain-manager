import { Navigate, Outlet } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const ProtectedRoute = () => {
  const [cookies] = useCookies(['userData']);
  const isAuthenticated = cookies.userData?._id;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;