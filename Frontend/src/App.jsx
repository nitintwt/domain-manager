import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from './components/Layout/DashboardLayout'
import ProtectedRoute from './ProtectedRoute';
import CloudflareAccounts from './pages/CloudflareAccounts';
import AddCloudflareAccount from './pages/AddCloudflareAccount';
import EditCloudflareAccount from './pages/EditCloudflareAccount';
import Servers from './pages/Servers';
import AddServer from './pages/AddServer';
import EditServer from './pages/EditServer';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Signup from './pages/Signup'
import Domain from "./pages/Domain";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Signup />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<CloudflareAccounts />} />
          <Route path="cloudflare" element={<CloudflareAccounts />} />
          <Route path="cloudflare/add" element={<AddCloudflareAccount />} />
          <Route path="cloudflare/edit/:id" element={<EditCloudflareAccount />} />
          <Route path="servers" element={<Servers />} />
          <Route path="servers/add" element={<AddServer />} />
          <Route path="servers/edit/:id" element={<EditServer />} />
          <Route path="domain" element={<Domain/>}/>
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;