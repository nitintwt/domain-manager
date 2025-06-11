import { useState } from "react";
import CustomModal from "../ui/CustomModal";
import CustomDropdown from "../ui/CustomDropdown";

// Mock data
const mockCloudflareAccounts = [
  { id: 1, name: "Main Account" },
  { id: 2, name: "Dev Account" },
  { id: 3, name: "Client Account" }
];

const mockServers = [
  { id: 1, name: "Production Server" },
  { id: 2, name: "Staging Server" },
  { id: 3, name: "Development Server" }
];

const CreateDomainModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    domainName: "",
    cloudflareAccount: "",
    createInCloudPanel: false,
    server: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.domainName && formData.cloudflareAccount) {
      onSubmit(formData);
      setFormData({
        domainName: "",
        cloudflareAccount: "",
        createInCloudPanel: false,
        server: ""
      });
    }
  };

  const handleClose = () => {
    setFormData({
      domainName: "",
      cloudflareAccount: "",
      createInCloudPanel: false,
      server: ""
    });
    onClose();
  };

  return (
    <CustomModal isOpen={isOpen} onClose={handleClose} title="Create Domain">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Domain Name
          </label>
          <input
            type="text"
            value={formData.domainName}
            onChange={(e) => setFormData({ ...formData, domainName: e.target.value })}
            placeholder="example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cloudflare Account
          </label>
          <CustomDropdown
            options={mockCloudflareAccounts}
            value={formData.cloudflareAccount}
            onChange={(value) => setFormData({ ...formData, cloudflareAccount: value })}
            placeholder="Select Cloudflare Account"
          />
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.createInCloudPanel}
              onChange={(e) => setFormData({ ...formData, createInCloudPanel: e.target.checked, server: "" })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Create domain in CloudPanel server
            </span>
          </label>
        </div>

        {formData.createInCloudPanel && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Server
            </label>
            <CustomDropdown
              options={mockServers}
              value={formData.server}
              onChange={(value) => setFormData({ ...formData, server: value })}
              placeholder="Select Server"
            />
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create
          </button>
        </div>
      </form>
    </CustomModal>
  );
};

export default CreateDomainModal;