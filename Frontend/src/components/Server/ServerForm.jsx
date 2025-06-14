import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Textarea } from "@heroui/input";
import { Spinner } from "@heroui/spinner";
import { ServerIcon, TestTubeIcon } from "lucide-react";
import StatusBadge from "../ui/StatusBadge";
import Modal from "../ui/Modal";
import axios from "axios";

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

  const [authMethod, setAuthMethod] = useState(
    initialData?.sshKey ? "key" : "password"
  );
  const [errors, setErrors] = useState({});
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  const validate = () => {
    const newErrors = {};

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

    // Validate based on selected auth method
    if (authMethod === "key" && !formData.sshKey.trim()) {
      newErrors.sshKey = "SSH key is required";
    }
    if (authMethod === "password" && !formData.sshPassword.trim()) {
      newErrors.sshPassword = "SSH password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleTestConnection = async () => {
  if (!validate()) return;

  setIsTestingConnection(true);
  setIsTestModalOpen(true);
  setTestResult(null);

  try {
    const response = await axios.post("/api/v1/server/server-credentials/test", {
        hostName: formData.hostName,
        sshPort: formData.sshPort,
        sshUsername: formData.sshUsername,
        sshPassword: formData.sshPassword
    });
    console.log("server test",response)
    if (response.data?.success) {
      setTestResult("success");
    } else {
      setTestResult("error");
    }
  } catch (error) {
    console.error("SSH Test Error:", error.response?.data || error.message);
    setTestResult("error");
  } finally {
    setIsTestingConnection(false);
  }};



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const submissionData = {
        ...formData,
        sshKey: authMethod === "key" ? formData.sshKey : "",
        sshPassword: authMethod === "password" ? formData.sshPassword : "",
      };
      await onSubmit(submissionData);
      navigate('/servers');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <Card className="bg-white shadow-lg rounded-xl border-0">
          <CardHeader className="px-6 py-5 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <ServerIcon className="h-6 w-6 text-blue-500" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {initialData ? "Edit" : "Add"} Server
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {initialData ? "Update your" : "Configure a new"} server settings
                </p>
              </div>
            </div>
          </CardHeader>

          <CardBody className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Server Details Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Server Name Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Server Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.serverName}
                    onChange={(e) => handleInputChange("serverName", e.target.value)}
                    placeholder="e.g., Production Server"
                    className={`w-full ${errors.serverName ? 'border-red-300' : ''}`}
                  />
                  {errors.serverName && (
                    <p className="text-sm text-red-600">{errors.serverName}</p>
                  )}
                </div>

                {/* Hostname Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Hostname <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.hostName}
                    onChange={(e) => handleInputChange("hostName", e.target.value)}
                    placeholder="e.g., server.example.com"
                    className={`w-full ${errors.hostName ? 'border-red-300' : ''}`}
                  />
                  {errors.hostName && (
                    <p className="text-sm text-red-600">{errors.hostName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* SSH Port Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    SSH Port <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={formData.sshPort}
                    onChange={(e) => handleInputChange("sshPort", parseInt(e.target.value))}
                    placeholder="22"
                    className={`w-full ${errors.sshPort ? 'border-red-300' : ''}`}
                  />
                  {errors.sshPort && (
                    <p className="text-sm text-red-600">{errors.sshPort}</p>
                  )}
                </div>

                {/* Server Location Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Server Location <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.serverLocation}
                    onChange={(e) => handleInputChange("serverLocation", e.target.value)}
                    placeholder="e.g., US East"
                    className={`w-full ${errors.serverLocation ? 'border-red-300' : ''}`}
                  />
                  {errors.serverLocation && (
                    <p className="text-sm text-red-600">{errors.serverLocation}</p>
                  )}
                </div>
              </div>

              {/* SSH Username Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  SSH Username <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.sshUsername}
                  onChange={(e) => handleInputChange("sshUsername", e.target.value)}
                  placeholder="e.g., root"
                  className={`w-full ${errors.sshUsername ? 'border-red-300' : ''}`}
                />
                {errors.sshUsername && (
                  <p className="text-sm text-red-600">{errors.sshUsername}</p>
                )}
              </div>

              {/* Authentication Method Selection */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Authentication Method <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={authMethod === "key"}
                      onChange={() => {
                        setAuthMethod("key");
                        setFormData(prev => ({ ...prev, sshPassword: "" }));
                        setErrors({});
                      }}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">SSH Key</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={authMethod === "password"}
                      onChange={() => {
                        setAuthMethod("password");
                        setFormData(prev => ({ ...prev, sshKey: "" }));
                        setErrors({});
                      }}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Password</span>
                  </label>
                </div>
              </div>

              {/* Conditional Authentication Fields */}
              {authMethod === "key" ? (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    SSH Private Key <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    value={formData.sshKey}
                    onChange={(e) => handleInputChange("sshKey", e.target.value)}
                    placeholder="Paste your SSH private key here"
                    rows={4}
                    className={`w-full ${errors.sshKey ? 'border-red-300' : ''}`}
                  />
                  {errors.sshKey && (
                    <p className="text-sm text-red-600">{errors.sshKey}</p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    SSH Password <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="password"
                    value={formData.sshPassword}
                    onChange={(e) => handleInputChange("sshPassword", e.target.value)}
                    placeholder="Enter SSH password"
                    className={`w-full ${errors.sshPassword ? 'border-red-300' : ''}`}
                  />
                  {errors.sshPassword && (
                    <p className="text-sm text-red-600">{errors.sshPassword}</p>
                  )}
                </div>
              )}

              {/* Form Actions */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleTestConnection}
                  disabled={isLoading}
                  className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <TestTubeIcon className="h-4 w-4" />
                  Test Connection
                </Button>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/servers")}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Spinner size="sm" />
                        <span>Saving...</span>
                      </div>
                    ) : (
                      <span>{initialData ? "Update" : "Add"} Server</span>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </CardBody>
        </Card>

        {/* Test Connection Modal */}
        <Modal
          isOpen={isTestModalOpen}
          onClose={() => !isTestingConnection && setIsTestModalOpen(false)}
          title="Test SSH Connection"
          description={`Testing connection to ${formData.hostName}...`}
          footer={
            <Button
              variant="outline"
              onClick={() => setIsTestModalOpen(false)}
              disabled={isTestingConnection}
            >
              Close
            </Button>
          }
        >
          <div className="flex flex-col items-center py-6 space-y-4">
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
                    : "Unable to establish SSH connection. Please check your credentials."
                  }
                </p>
              </>
            ) : null}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ServerForm;