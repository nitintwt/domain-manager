import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectSection, SelectItem } from "@heroui/select";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Textarea } from "@heroui/input";
import { Spinner } from "@heroui/spinner";
import { TestTube, CloudIcon, ChevronLeft } from "lucide-react";
import TestCredentialsModal from "./TestCredentialsModal";

const CloudflareAccountForm = ({ initialData, onSubmit, isLoading }) => {
  const navigate = useNavigate();
  const [showTestModal, setShowTestModal] = useState(false);
  const [formData, setFormData] = useState({
    accountName: initialData?.accountName || "",
    email: initialData?.email || "",
    accountType: initialData?.accountType || "Free",
    apiToken: initialData?.apiToken || "",
    zoneId: initialData?.zoneId || "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.accountName.trim()) {
      newErrors.accountName = "Account name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.accountType) {
      newErrors.accountType = "Account type is required";
    }
    
    if (!formData.apiToken.trim()) {
      newErrors.apiToken = "API token is required";
    }
    
    if (!formData.zoneId.trim()) {
      newErrors.zoneId = "Zone ID is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await onSubmit(formData);
        navigate("/cloudflare");
      } catch (error) {
        setErrors(prev => ({
          ...prev,
          submit: "Failed to save account. Please try again."
        }));
      }
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleTestCredentials = () => {
    if (!formData.apiToken.trim() || !formData.zoneId.trim()) {
      setErrors(prev => ({
        ...prev,
        apiToken: !formData.apiToken.trim() ? "API token is required for testing" : "",
        zoneId: !formData.zoneId.trim() ? "Zone ID is required for testing" : ""
      }));
      return;
    }
    setShowTestModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <button 
          onClick={() => navigate("/cloudflare")}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Accounts
        </button>

        <Card className="bg-white shadow-lg rounded-xl border-0">
          <CardHeader className="px-6 py-5 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <CloudIcon className="w-6 h-6 text-blue-500" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {initialData ? "Edit" : "Add"} Cloudflare Account
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {initialData ? "Update your" : "Configure a new"} Cloudflare account settings
                </p>
              </div>
            </div>
          </CardHeader>

          <CardBody className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="accountName" className="block text-sm font-medium text-gray-700">
                    Account Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="accountName"
                    placeholder="e.g., Production Account"
                    value={formData.accountName}
                    onChange={(e) => handleInputChange("accountName", e.target.value)}
                    className={`w-full rounded-lg ${errors.accountName ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                  />
                  {errors.accountName && (
                    <p className="text-sm text-red-600">{errors.accountName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@company.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`w-full rounded-lg ${errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="accountType" className="block text-sm font-medium text-gray-700">
                  Account Type <span className="text-red-500">*</span>
                </label>
                <Select
                  id="accountType"
                  value={formData.accountType}
                  onValueChange={(value) => handleInputChange("accountType", value)}
                  className={`w-full rounded-lg ${errors.accountType ? 'border-red-300' : 'border-gray-300'}`}
                >
                  <SelectSection>
                    {["Free", "Pro", "Business", "Enterprise"].map((type) => (
                      <SelectItem key={type} value={type} className="py-2 px-3">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectSection>
                </Select>
                {errors.accountType && (
                  <p className="text-sm text-red-600">{errors.accountType}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="apiToken" className="block text-sm font-medium text-gray-700">
                  API Token <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="apiToken"
                  value={formData.apiToken}
                  onChange={(e) => handleInputChange("apiToken", e.target.value)}
                  placeholder="Enter your Cloudflare API token"
                  rows={3}
                  className={`w-full rounded-lg ${errors.apiToken ? 'border-red-300' : 'border-gray-300'}`}
                />
                {errors.apiToken && (
                  <p className="text-sm text-red-600">{errors.apiToken}</p>
                )}
                <p className="text-xs text-gray-500">
                  Find your API token in Cloudflare dashboard under My Profile → API Tokens
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="zoneId" className="block text-sm font-medium text-gray-700">
                  Zone ID <span className="text-red-500">*</span>
                </label>
                <Input
                  id="zoneId"
                  value={formData.zoneId}
                  onChange={(e) => handleInputChange("zoneId", e.target.value)}
                  placeholder="Enter your Cloudflare Zone ID"
                  className={`w-full rounded-lg ${errors.zoneId ? 'border-red-300' : 'border-gray-300'}`}
                />
                {errors.zoneId && (
                  <p className="text-sm text-red-600">{errors.zoneId}</p>
                )}
                <p className="text-xs text-gray-500">
                  Find the Zone ID in your domain's overview page in the Cloudflare dashboard
                </p>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row sm:justify-between items-stretch gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleTestCredentials}
                    className="flex items-center justify-center px-4 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50"
                  >
                    <TestTube className="w-4 h-4 mr-2" />
                    Test Credentials
                  </Button>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/cloudflare")}
                      disabled={isLoading}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <Spinner size="sm" className="mr-2" />
                          <span>Saving...</span>
                        </div>
                      ) : (
                        <span>{initialData ? "Update" : "Add"} Account</span>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>

      <TestCredentialsModal 
        open={showTestModal} 
        onClose={() => setShowTestModal(false)}
        accountId={initialData?.id || null}
      />
    </div>
  );
};

export default CloudflareAccountForm;