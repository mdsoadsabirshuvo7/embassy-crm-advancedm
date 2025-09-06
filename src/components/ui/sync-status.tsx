import React from 'react';
import { Wifi, WifiOff, RotateCcw, CheckCircle, AlertCircle } from 'lucide-react';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { Button } from './button';
import { Badge } from './badge';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';

export const SyncStatus: React.FC = () => {
  const { isOnline, lastSync, pendingSync, isSyncing, forceSync } = useNetworkStatus();

  const getSyncIcon = () => {
    if (!isOnline) return <WifiOff className="w-4 h-4" />;
    if (isSyncing) return <RotateCcw className="w-4 h-4 animate-spin" />;
    if (pendingSync > 0) return <AlertCircle className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  const getSyncText = () => {
    if (!isOnline) return 'Offline';
    if (isSyncing) return 'Syncing...';
    if (pendingSync > 0) return `${pendingSync} pending`;
    return 'Synced';
  };

  const getSyncVariant = (): "default" | "secondary" | "destructive" | "outline" => {
    if (!isOnline) return 'destructive';
    if (isSyncing) return 'secondary';
    if (pendingSync > 0) return 'outline';
    return 'default';
  };

  const formatLastSync = () => {
    if (!lastSync) return 'Never';
    const now = new Date();
    const diff = now.getTime() - lastSync.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant={getSyncVariant()} className="flex items-center gap-1">
            {getSyncIcon()}
            {getSyncText()}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <div>Status: {isOnline ? 'Online' : 'Offline'}</div>
            <div>Last sync: {formatLastSync()}</div>
            {pendingSync > 0 && <div>Pending: {pendingSync} items</div>}
          </div>
        </TooltipContent>
      </Tooltip>
      
      {isOnline && !isSyncing && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={forceSync}
              className="h-8 w-8 p-0"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <span>Force sync</span>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};