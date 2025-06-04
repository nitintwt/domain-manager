import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {Button, ButtonGroup} from "@heroui/button";
import {Input} from "@heroui/input";
import {Card, CardHeader, CardBody, CardFooter} from "@heroui/card";
import {Textarea} from "@heroui/input";
import {Spinner} from "@heroui/spinner";

import StatusBadge from "../ui/StatusBadge";


const ServerForm = ({ initialData, onSubmit, isLoading }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    serverName: initialData?.serverName || "",
    hostName: initialData?.hostName || "",
    sshPort: initialData?.sshPort || 22,
    serverLocation: initialData?.serverLocation || "",
    sshUsername: initialData?.sshUsername || "",
    sshKey: initialData?.sshKey || "",
    sshPassword: initialData?.sshPassword || "",
  });

  const [errors, setErrors] = useState({});

  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null);
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  const validate = () => {
    const newErrors= {};

    if (!formData.serverName.trim()) {
      newErrors.serverName = "Server name is required";
    }

    if (!formData.hostName.trim()) {
      newErrors.hostName = "Hostname is required";
    }

    if (!formData.sshPort || formData.sshPort < 1 || formData.sshPort > 65535) {
      newErrors.sshPort = "SSH port must be between 1 and 65535";
    }

    if (!formData.serverLocation.trim()) {
      newErrors.serverLocation = "Server location is required";
    }

    if (!formData.sshUsername.trim()) {
      newErrors.sshUsername = "SSH username is required";
    }

    if (!formData.sshKey.trim() && !formData.sshPassword.trim()) {
      newErrors.sshKey = "Either SSH key or password is required";
      newErrors.sshPassword = "Either SSH key or password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateTestFields = () => {
    const testErrors = {};

    if (!formData.hostName.trim()) {
      testErrors.hostName = "Hostname is required";
    }

    if (!formData.sshPort || formData.sshPort < 1 || formData.sshPort > 65535) {
      testErrors.sshPort = "SSH port must be between 1 and 65535";
    }

    if (!formData.sshUsername.trim()) {
      testErrors.sshUsername = "SSH username is required";
    }

    if (!formData.sshKey.trim() && !formData.sshPassword.trim()) {
      testErrors.sshKey = "Either SSH key or password is required";
      testErrors.sshPassword = "Either SSH key or password is required";
    }

    setErrors(testErrors);
    return Object.keys(testErrors).length === 0;
  };

  const handleTestConnection = async () => {
    if (!validateTestFields()) {
      return;
    }

    setIsTestingConnection(true);
    setIsTestModalOpen(true);
    setTestResult(null);

    try {
      // Simulate SSH connection test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate random success/failure for demo
      const isSuccess = Math.random() > 0.3;
      setTestResult(isSuccess ? "success" : "error");
    } catch (error) {
      setTestResult("error");
    } finally {
      setIsTestingConnection(false);
    }
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

  return (
    <>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>{initialData ? "Edit" : "Add"} Server</CardTitle>
          <CardDescription>
            {initialData ? "Update your" : "Add a new"} server configuration for remote management
          </CardDescription>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 htmlFor="serverName">Server Name</h3>
                <Input
                  id="serverName"
                  placeholder="e.g., Production Server"
                  value={formData.serverName}
                  onChange={(e) => handleInputChange("serverName", e.target.value)}
                  className={errors.serverName ? "border-red-500" : ""}
                />
                {errors.serverName && (
                  <p className="text-sm text-red-600">{errors.serverName}</p>
                )}
              </div>

              <div className="space-y-2">
                <h3 htmlFor="hostName">Hostname</h3>
                <Input
                  id="hostName"
                  placeholder="e.g., server.company.com"
                  value={formData.hostName}
                  onChange={(e) => handleInputChange("hostName", e.target.value)}
                  className={errors.hostName ? "border-red-500" : ""}
                />
                {errors.hostName && (
                  <p className="text-sm text-red-600">{errors.hostName}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 htmlFor="sshPort">SSH Port</h3>
                <Input
                  id="sshPort"
                  type="number"
                  min="1"
                  max="65535"
                  placeholder="22"
                  value={formData.sshPort}
                  onChange={(e) => handleInputChange("sshPort", parseInt(e.target.value) || 22)}
                  className={errors.sshPort ? "border-red-500" : ""}
                />
                {errors.sshPort && (
                  <p className="text-sm text-red-600">{errors.sshPort}</p>
                )}
              </div>

              <div className="space-y-2">
                <h3 htmlFor="serverLocation">Server Location</h3>
                <Input
                  id="serverLocation"
                  placeholder="e.g., US East, Europe West"
                  value={formData.serverLocation}
                  onChange={(e) => handleInputChange("serverLocation", e.target.value)}
                  className={errors.serverLocation ? "border-red-500" : ""}
                />
                {errors.serverLocation && (
                  <p className="text-sm text-red-600">{errors.serverLocation}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h3 htmlFor="sshUsername">SSH Username</h3>
              <Input
                id="sshUsername"
                placeholder="e.g., root, ubuntu, admin"
                value={formData.sshUsername}
                onChange={(e) => handleInputChange("sshUsername", e.target.value)}
                className={errors.sshUsername ? "border-red-500" : ""}
              />
              {errors.sshUsername && (
                <p className="text-sm text-red-600">{errors.sshUsername}</p>
              )}
            </div>

            <div className="space-y-2">
              <h3 htmlFor="sshKey">SSH Private Key</h3>
              <Textarea
                id="sshKey"
                placeholder="-----BEGIN OPENSSH PRIVATE KEY-----"
                value={formData.sshKey}
                onChange={(e) => handleInputChange("sshKey", e.target.value)}
                className={errors.sshKey ? "border-red-500" : ""}
                rows={6}
              />
              {errors.sshKey && (
                <p className="text-sm text-red-600">{errors.sshKey}</p>
              )}
              <p className="text-xs text-gray-500">
                Paste your private SSH key here. This will be stored securely.
              </p>
            </div>

            <div className="space-y-2">
              <h3 htmlFor="sshPassword">SSH Password (Optional)</h3>
              <Input
                id="sshPassword"
                type="password"
                placeholder="Enter SSH password if not using key authentication"
                value={formData.sshPassword}
                onChange={(e) => handleInputChange("sshPassword", e.target.value)}
                className={errors.sshPassword ? "border-red-500" : ""}
              />
              {errors.sshPassword && (
                <p className="text-sm text-red-600">{errors.sshPassword}</p>
              )}
              <p className="text-xs text-gray-500">
                Only required if not using SSH key authentication
              </p>
            </div>

            <div className="flex justify-between items-center pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleTestConnection}
                disabled={isLoading}
                className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
              >
                Test Connection
              </Button>
              
              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/servers")}
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
                    <span>{initialData ? "Update" : "Add"} Server</span>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardBody>
      </Card>

      {/*<Dialog open={isTestModalOpen} onOpenChange={setIsTestModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Test SSH Connection</DialogTitle>
            <DialogDescription>
              Testing connection to {formData.hostName || "server"}...
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center space-y-4 py-6">
            {isTestingConnection ? (
              <>
                <Spinner size="lg" />
                <p className="text-sm text-gray-600">Connecting to server...</p>
              </>
            ) : testResult ? (
              <>
                <StatusBadge status={testResult}>
                  {testResult === "success" ? "Connection Successful" : "Connection Failed"}
                </StatusBadge>
                <p className="text-sm text-gray-600 text-center">
                  {testResult === "success" 
                    ? "SSH connection established successfully!" 
                    : "Unable to establish SSH connection. Please check your credentials and network settings."
                  }
                </p>
              </>
            ) : null}
          </div>
          
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => setIsTestModalOpen(false)}
              disabled={isTestingConnection}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>*/}
    </>
  );
};

export default ServerForm;
