import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {Button, ButtonGroup} from "@heroui/button";
import {Input} from "@heroui/input";
import { h3 } from "@/components/ui/label";
import {Select, SelectSection, SelectItem} from "@heroui/select";
import {Card, CardHeader, CardBody, CardFooter} from "@heroui/card";
import {Textarea} from "@heroui/input";
import {Spinner} from "@heroui/spinner";
import TestCredentialsModal from "./TestCredentialsModal";
import { TestTube } from "lucide-react";

const CloudflareAccountForm = ({ initialData, onSubmit, isLoading }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    accountName: initialData?.accountName || "",
    email: initialData?.email || "",
    accountType: initialData?.accountType || "",
    apiToken: initialData?.apiToken || "",
    zoneId: initialData?.zoneId || "",
  });

  const [errors, setErrors] = useState({});
  const [showTestModal, setShowTestModal] = useState(false);

  const validate = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleTestCredentials = () => {
    // Check if required fields for testing are filled
    if (!formData.apiToken.trim() || !formData.zoneId.trim()) {
      setErrors(prev => ({
        ...prev,
        apiToken: !formData.apiToken.trim() ? "API token is required for testing" : "",
        zoneId: !formData.zoneId.trim() ? "Zone ID is required for testing" : "",
      }));
      return;
    }
    setShowTestModal(true);
  };

  return (
    <>
      <Card className="max-w-2xl">
        <CardHeader>
          <h3>{initialData ? "Edit" : "Add"} Cloudflare Account</h3>
          <CardBody>
            {initialData ? "Update your" : "Add a new"} Cloudflare account configuration
          </CardBody>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <h3 htmlFor="accountName">Account Name</h3>
              <Input
                id="accountName"
                placeholder="e.g., Production Account"
                value={formData.accountName}
                onChange={(e) => handleInputChange("accountName", e.target.value)}
                className={errors.accountName ? "border-red-500" : ""}
              />
              {errors.accountName && (
                <p className="text-sm text-red-600">{errors.accountName}</p>
              )}
            </div>

            <div className="space-y-2">
              <h3 htmlFor="email">Email</h3>
              <Input
                id="email"
                type="email"
                placeholder="admin@company.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <h3 htmlFor="accountType">Account Type</h3>
              <Select value={formData.accountType} onValueChange={(value) => handleInputChange("accountType", value)}>
                <SelectTrigger className={errors.accountType ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Free">Free</SelectItem>
                  <SelectItem value="Pro">Pro</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
              {errors.accountType && (
                <p className="text-sm text-red-600">{errors.accountType}</p>
              )}
            </div>

            <div className="space-y-2">
              <h3 htmlFor="apiToken">API Token</h3>
              <Textarea
                id="apiToken"
                placeholder="Enter your Cloudflare API token"
                value={formData.apiToken}
                onChange={(e) => handleInputChange("apiToken", e.target.value)}
                className={errors.apiToken ? "border-red-500" : ""}
                rows={3}
              />
              {errors.apiToken && (
                <p className="text-sm text-red-600">{errors.apiToken}</p>
              )}
              <p className="text-xs text-gray-500">
                You can find your API token in the Cloudflare dashboard under My Profile → API Tokens
              </p>
            </div>

            <div className="space-y-2">
              <h3 htmlFor="zoneId">Zone ID</h3>
              <Input
                id="zoneId"
                placeholder="Enter your Cloudflare Zone ID"
                value={formData.zoneId}
                onChange={(e) => handleInputChange("zoneId", e.target.value)}
                className={errors.zoneId ? "border-red-500" : ""}
              />
              {errors.zoneId && (
                <p className="text-sm text-red-600">{errors.zoneId}</p>
              )}
              <p className="text-xs text-gray-500">
                You can find the Zone ID in your domain's overview page in the Cloudflare dashboard
              </p>
            </div>

            {/* Test Credentials Button */}
            <div className="pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleTestCredentials}
                className="w-full sm:w-auto"
              >
                <TestTube className="w-4 h-4 mr-2" />
                Test Credentials
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                Test your API token and Zone ID before saving
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/cloudflare")}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Spinner size="sm" />
                    <span className="ml-2">Saving...</span>
                  </>
                ) : (
                  <span>{initialData ? "Update" : "Add"} Account</span>
                )}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      <TestCredentialsModal 
        open={showTestModal} 
        onClose={() => setShowTestModal(false)}
        accountId={initialData?.id || null}
      />
    </>
  );
};

export default CloudflareAccountForm;
