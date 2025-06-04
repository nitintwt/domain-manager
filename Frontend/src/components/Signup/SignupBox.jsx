import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { Button } from '@heroui/button';
import axios from 'axios';
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Input } from "@heroui/input";

export default function SignupBox() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const register = await axios.post(`/api/v1/auth/register`, {
        name: name,
        email: email,
        password: password
      });
      toast.success("User registered successfully");
      setTimeout(() => {
        navigate("/login");
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
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Create an account</h2>
            <p className="text-sm text-gray-500">
              Sign up to get started with Domain Manager
            </p>
          </CardHeader>

          <CardBody className="space-y-6 p-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

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
              <p className="text-xs text-gray-500">
                Password must be at least 8 characters long
              </p>
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white hover:bg-blue-700 shadow-sm py-2.5 rounded-lg transition-colors"
            >
              Create Account
            </Button>
          </CardBody>

          <CardFooter className="px-6 pb-6 pt-0">
            <p className="text-sm text-center text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
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