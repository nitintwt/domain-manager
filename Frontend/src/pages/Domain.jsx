
import { useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import {Textarea} from "@heroui/input";
import {  Table,  TableHeader,  TableBody,  TableColumn,  TableRow,  TableCell} from "@heroui/table";
import { Badge } from "@heroui/badge";
import { Check, X, RefreshCw, Globe } from "lucide-react";


const Domain = () => {
  const [domainInput, setDomainInput] = useState("");
  const [domains, setDomains] = useState([]);
  const [isCheckingAll, setIsCheckingAll] = useState(false);

  const parseDomains = () => {
    const lines = domainInput
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    // Remove duplicates
    const uniqueDomains = [...new Set(lines)];
    
    const newDomains = uniqueDomains.map(domain => ({
      domain,
      cloudpanelStatus: "unchecked",
      cloudflareStatus: "unchecked",
      lastChecked: null,
    }));
    
    setDomains(newDomains);
  };

  const checkSingleDomain = async (domain) => {
    setDomains(prev => prev.map(d => 
      d.domain === domain 
        ? { ...d, cloudpanelStatus: "checking", cloudflareStatus: "checking" }
        : d
    ));

    // Simulate API calls
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
    
    // Set all domains to checking status
    setDomains(prev => prev.map(d => ({
      ...d,
      cloudpanelStatus: "checking",
      cloudflareStatus: "checking"
    })));

    // Simulate staggered API calls
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
        
        if (i === domains.length - 1) {
          setIsCheckingAll(false);
        }
      }, (i + 1) * 500);
    }
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
        return <span className="h-4 w-4 bg-gray-300 rounded-full" />;
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
      <Badge className={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  const formatLastChecked = (date) => {
    if (!date) return "Never";
    return date.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Domain Status Checker</h1>
      </div>

      {/* Domain Input Section */}
      <Card>
        <CardHeader>
          <h2 className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>Domain Input</span>
          </h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <div>
            <p htmlFor="domainInput">Enter domains (one per line)</p>
            <Textarea
              id="domainInput"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              placeholder="example.com&#10;api.example.com&#10;staging.example.com"
              className="min-h-32"
            />
          </div>
          <Button onClick={parseDomains} disabled={!domainInput.trim()}>
            Parse Domains
          </Button>
        </CardBody>
      </Card>

      {/* Domain Status Table */}
      {domains.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <h2>Domain Status Results</h2>
              <Button 
                onClick={checkAllDomains} 
                disabled={isCheckingAll}
                className="flex items-center space-x-2"
              >
                {isCheckingAll && <RefreshCw className="h-4 w-4 animate-spin" />}
                <span>Check All Domains</span>
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <Table>
              <TableHeader>
                  <TableColumn>Domain Name</TableColumn>
                  <TableColumn>CloudPanel Status</TableColumn>
                  <TableColumn>Cloudflare Status</TableColumn>
                  <TableColumn>Last Checked</TableColumn>
                  <TableColumn className="w-32">Actions</TableColumn>
              </TableHeader>
              <TableBody>
                {domains.map((domain) => (
                  <TableRow key={domain.domain}>
                    <TableCell className="font-medium font-mono">{domain.domain}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(domain.cloudpanelStatus)}
                        {getStatusBadge(domain.cloudpanelStatus)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(domain.cloudflareStatus)}
                        {getStatusBadge(domain.cloudflareStatus)}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatLastChecked(domain.lastChecked)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => checkSingleDomain(domain.domain)}
                        disabled={domain.cloudpanelStatus === "checking" || domain.cloudflareStatus === "checking"}
                        className="flex items-center space-x-1"
                      >
                        <RefreshCw className={`h-3 w-3 ${
                          (domain.cloudpanelStatus === "checking" || domain.cloudflareStatus === "checking") 
                            ? "animate-spin" 
                            : ""
                        }`} />
                        <span>Check</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default Domain;