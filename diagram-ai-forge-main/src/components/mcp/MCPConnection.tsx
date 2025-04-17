
import { useState, useEffect } from 'react';
import { useMCPConnection } from '@/services/mcpService';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  ServerIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  AlertCircleIcon,
  LoaderIcon
} from 'lucide-react';

export function MCPConnection() {
  const { 
    status, 
    config, 
    connect, 
    disconnect, 
    updateConfig 
  } = useMCPConnection();
  
  const [serverUrl, setServerUrl] = useState(config.serverUrl);
  const [apiKey, setApiKey] = useState(config.apiKey || '');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Update form fields when config changes
  useEffect(() => {
    setServerUrl(config.serverUrl);
    setApiKey(config.apiKey || '');
  }, [config]);

  // Apply config changes
  const handleApplyConfig = () => {
    updateConfig({
      serverUrl,
      apiKey: apiKey.trim() ? apiKey : undefined
    });
    setIsDialogOpen(false);
  };

  // Render connection status badge
  const renderStatusBadge = () => {
    switch (status) {
      case 'connected':
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-600/20">
            <CheckCircleIcon className="w-3 h-3 mr-1" /> Connected
          </Badge>
        );
      case 'connecting':
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-600/20">
            <LoaderIcon className="w-3 h-3 mr-1 animate-spin" /> Connecting
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-600/20">
            <AlertCircleIcon className="w-3 h-3 mr-1" /> Error
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-500/10 text-gray-600 border-gray-600/20">
            <XCircleIcon className="w-3 h-3 mr-1" /> Disconnected
          </Badge>
        );
    }
  };

  return (
    <div className="flex items-center gap-2">
      {renderStatusBadge()}
      
      {status === 'connected' ? (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={disconnect}
          className="h-8 px-2 text-xs"
        >
          Disconnect
        </Button>
      ) : (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={connect}
          className="h-8 px-2 text-xs"
          disabled={status === 'connecting'}
        >
          Connect
        </Button>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <ServerIcon className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>MCP Server Configuration</DialogTitle>
            <DialogDescription>
              Configure the connection to your MCP server.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="server-url" className="text-right">
                Server URL
              </Label>
              <Input
                id="server-url"
                value={serverUrl}
                onChange={(e) => setServerUrl(e.target.value)}
                placeholder="ws://your-mcp-server.com"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="api-key" className="text-right">
                API Key
              </Label>
              <Input
                id="api-key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Optional"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleApplyConfig}>
              Apply Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
