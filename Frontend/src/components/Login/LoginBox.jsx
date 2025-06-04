import { useState } from 'react';
import { Toaster, toast } from 'sonner';
import { Button } from '@heroui/button';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Input } from "@heroui/input";

export default function LoginBox() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const [cookies, setCookies] = useCookies();

  const handleSubmit = async () => {
    try {
      const login = await axios.post(`/api/v1/auth/login`, {
        email: email,
        password: password
      });
      setCookies("userData", {
        _id: login?.data?.data?.user?._id,
        email: login?.data?.data?.user?.email,
        name: login?.data?.data?.user?.fullName,
        paidUser: login?.data?.data?.user?.paidUser
      });
      toast.success("Login successful");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            
          </div>
        </div>

        <Card className="w-full bg-white shadow-xl border border-gray-100 rounded-xl">
          <CardHeader className="space-y-2 text-center p-6 pb-0">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Welcome back</h2>
            <p className="text-sm text-gray-500">
              Enter your credentials to access your account
            </p>
          </CardHeader>

          <CardBody className="space-y-6 p-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white hover:bg-blue-700 shadow-sm py-2.5 rounded-lg transition-colors"
            >
              Sign in
            </Button>
          </CardBody>

          <CardFooter className="px-6 pb-6 pt-0">
            <p className="text-sm text-center text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>

      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#fff',
            color: '#333',
            border: '1px solid #e2e8f0',
            borderRadius: '0.5rem',
          },
          duration: 2000,
        }}
      />
    </div>
  );
}