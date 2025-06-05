import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import StatusBadge from "../ui/StatusBadge";
import { Spinner } from "@heroui/spinner";
import { CheckCircle, XCircle } from "lucide-react";
import Modal from "../ui/Modal";
import axios from "axios";

const TestCredentialsModal = ({ open, onClose, credentials }) => {
  const [status, setStatus] = useState("testing");

  useEffect(() => {
    if (open && credentials?.apiToken) {
      setStatus("testing");
      const testCloudflareToken = async () => {
        try {
          const response = await axios.post("/api/v1/cloudflare/cloudflare-accounts/test", {
            apiToken: credentials.apiToken
          });
          
          if (response.data?.success) {
            setStatus("success");
          } else {
            setStatus("error");
          }
        } catch (error) {
          console.error("API Error:", error);
          setStatus("error");
        }
      };

      testCloudflareToken();
    }
  }, [open, credentials]);

  const getStatusContent = () => {
    switch (status) {
      case "testing":
        return {
          icon: <Spinner size="lg" />,
          title: "Testing Credentials",
          description: "Verifying your Cloudflare API token...",
        };
      case "success":
        return {
          icon: <CheckCircle className="h-12 w-12 text-green-500" />,
          title: "Token Valid",
          description: "Your Cloudflare API token is working correctly.",
        };
      case "error":
        return {
          icon: <XCircle className="h-12 w-12 text-red-500" />,
          title: "Token Invalid",
          description: "The API token is invalid or has expired. Please check your credentials.",
        };
      default:
        return {
          icon: null,
          title: "",
          description: "",
        };
    }
  };

  const content = getStatusContent();

  return (
    <Modal
      isOpen={open}
      onClose={() => status !== "testing" && onClose()}
      title="Test Cloudflare Credentials"
      description="Verifying API token with Cloudflare"
      footer={
        <Button
          variant="outline"
          onClick={onClose}
          disabled={status === "testing"}
          className="px-4 py-2 text-sm"
        >
          Close
        </Button>
      }
    >
      <div className="flex flex-col items-center py-6 space-y-4">
        {content.icon}
        <div className="text-center space-y-2">
          <h3 className="font-medium text-gray-900">{content.title}</h3>
          <p className="text-sm text-gray-500">{content.description}</p>
          {status !== "testing" && (
            <StatusBadge status={status}>
              {status === "success" ? "Token Valid" : "Token Invalid"}
            </StatusBadge>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default TestCredentialsModal;