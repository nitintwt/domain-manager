import { useState, useEffect } from "react";
import {Button, ButtonGroup} from "@heroui/button";
import StatusBadge from "../ui/StatusBadge";
import {Spinner} from "@heroui/spinner";
import { CheckCircle, XCircle } from "lucide-react";

const TestCredentialsModal = ({ open, onClose, accountId }) => {
  // FIX: Remove TypeScript type annotation for useState
  const [status, setStatus] = useState("testing");

  useEffect(() => {
    if (open && accountId) {
      setStatus("testing");
      // Simulate API call
      const timer = setTimeout(() => {
        // Random success/failure for demo
        setStatus(Math.random() > 0.3 ? "success" : "error");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [open, accountId]);

  const getStatusContent = () => {
    switch (status) {
      case "testing":
        return {
          icon: <Spinner size="md" />,
          title: "Testing Credentials",
          description: "Verifying your Cloudflare API credentials...",
          badge: null,
        };
      case "success":
        return {
          icon: <CheckCircle className="h-8 w-8 text-green-500" />,
          title: "Credentials Valid",
          description: "Your Cloudflare API credentials are working correctly.",
          badge: <StatusBadge status="success">Connected</StatusBadge>,
        };
      case "error":
        return {
          icon: <XCircle className="h-8 w-8 text-red-500" />,
          title: "Credentials Invalid",
          description: "Unable to connect to Cloudflare with the provided credentials. Please check your API token and Zone ID.",
          badge: <StatusBadge status="error">Connection Failed</StatusBadge>,
        };
      default:
        return {
          icon: null,
          title: "",
          description: "",
          badge: null,
        };
    }
  };

  const content = getStatusContent();

  return (
    <div>
      {/* Uncomment and use your Dialog components when ready */}
      {/* 
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Test Cloudflare Credentials</DialogTitle>
            <DialogDescription>
              Testing connection to Cloudflare API
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center py-6 space-y-4">
            {content.icon}
            <div className="text-center space-y-2">
              <h3 className="font-medium text-gray-900">{content.title}</h3>
              <p className="text-sm text-gray-500">{content.description}</p>
              {content.badge && (
                <div className="flex justify-center pt-2">
                  {content.badge}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={onClose} disabled={status === "testing"}>
              {status === "testing" ? "Testing..." : "Close"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      */}
    </div>
  );
};

export default TestCredentialsModal;