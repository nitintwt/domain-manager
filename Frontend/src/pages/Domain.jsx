import { useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Textarea } from "@heroui/input";
import { Badge } from "@heroui/badge";
import { Check, X, RefreshCw, Globe, RotateCw } from "lucide-react";

const Domain = () => {
  const [domainInput, setDomainInput] = useState("");
  const [domains, setDomains] = useState([]);
  const [isCheckingAll, setIsCheckingAll] = useState(false);

  const parseDomains = () => {
    const lines = domainInput
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const uniqueDomains = [...new Set(lines)];
    const newDomains = uniqueDomains.map(domain => ({
      domain,
      cloudpanelStatus: "unchecked",
      cloudflareStatus: "unchecked",
      lastChecked: null
    }));

    setDomains(newDomains);
  };

  const checkSingleDomain = async (domain) => {
    setDomains(prev => prev.map(d =>
      d.domain === domain
        ? { ...d, cloudpanelStatus: "checking", cloudflareStatus: "checking" }
        : d
    ));

    setTimeout(() => {
      setDomains(prev => prev.map(d =>
        d.domain === domain
          ? {
            ...d,
            cloudpanelStatus: Math.random() > 0.5 ? "found" : "not-found",
            cloudflareStatus: Math.random() > 0.5 ? "found" : "not-found",
            lastChecked: new Date()
          }
          : d
      ));
    }, 2000);
  };

  const checkAllDomains = async () => {
    setIsCheckingAll(true);
    setDomains(prev => prev.map(d => ({
      ...d,
      cloudpanelStatus: "checking",
      cloudflareStatus: "checking"
    })));

    for (let i = 0; i < domains.length; i++) {
      setTimeout(() => {
        setDomains(prev => prev.map((d, index) =>
          index === i
            ? {
              ...d,
              cloudpanelStatus: Math.random() > 0.5 ? "found" : "not-found",
              cloudflareStatus: Math.random() > 0.5 ? "found" : "not-found",
              lastChecked: new Date()
            }
            : d
        ));

        if (i === domains.length - 1) setIsCheckingAll(false);
      }, (i + 1) * 500);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      found: "bg-green-100 text-green-800",
      "not-found": "bg-red-100 text-red-800",
      checking: "bg-blue-100 text-blue-800",
      unchecked: "bg-gray-100 text-gray-800"
    };

    const labels = {
      found: "Found",
      "not-found": "Not Found",
      checking: "Checking...",
      unchecked: "Unchecked"
    };

    return (
      <div className="flex items-center gap-2">
        {getStatusIcon(status)}
        <Badge className={`rounded-full px-3 py-1 text-sm `}>{labels[status]}</Badge>
      </div>
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "found":
        return <Check className="h-4 w-4 text-green-600" />;
      case "not-found":
        return <X className="h-4 w-4 text-red-600" />;
      case "checking":
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      default:
        return <span className="h-4 w-4 bg-gray-300 rounded-full inline-block" />;
    }
  };

  const formatLastChecked = (date) => {
    if (!date) return "Never";
    return new Intl.DateTimeFormat("default", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(new Date(date));
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader className="flex items-center gap-2 text-xl font-semibold">
          <Globe className="w-5 h-5" /> Domain
        </CardHeader>
        <CardBody className="space-y-4">
          <Textarea
            minRows={3}
            placeholder="Enter domains (one per line)"
            value={domainInput}
            onChange={(e) => setDomainInput(e.target.value)}
          />
          <Button onClick={parseDomains} className="bg-blue-600 text-white hover:bg-blue-700 p-2 rounded-xl" >Parse Domains</Button>
        </CardBody>
      </Card>
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Domains</h2>
          <Button variant="ghost" className="bg-blue-600 text-white hover:bg-blue-700 p-2 rounded-xl" onClick={checkAllDomains} disabled={isCheckingAll}>
            <RotateCw className="w-4 h-4" /> Check All Domains
          </Button>
        </CardHeader>
        <CardBody className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domain Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CloudPanel Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cloudflare Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Checked</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {domains.map((domain) => (
                <tr key={domain.domain} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">{domain.domain}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(domain.cloudpanelStatus)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(domain.cloudflareStatus)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatLastChecked(domain.lastChecked)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => checkSingleDomain(domain.domain)}
                      className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    >
                      <RotateCw className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
};

export default Domain;
