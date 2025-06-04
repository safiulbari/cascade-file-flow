
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertCircle, Clock, Loader2, FileText, Pause } from 'lucide-react';

interface DownloadStatus {
  id: string;
  filename: string;
  status: 'queued' | 'downloading' | 'completed' | 'failed' | 'paused';
  progress?: number;
  size?: string;
  error?: string;
}

interface DownloadItemProps {
  download: DownloadStatus;
}

const DownloadItem: React.FC<DownloadItemProps> = ({ download }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'queued':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'downloading':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'paused':
        return <Pause className="h-4 w-4 text-orange-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      queued: 'secondary',
      downloading: 'default',
      completed: 'default',
      failed: 'destructive',
      paused: 'secondary'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="p-3 bg-slate-700 rounded-lg space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          {getStatusIcon(download.status)}
          <span className="text-sm text-white truncate" title={download.filename}>
            {download.filename}
          </span>
        </div>
        {getStatusBadge(download.status)}
      </div>
      
      {(download.status === 'downloading' || download.status === 'paused') && download.progress !== undefined && (
        <Progress value={download.progress} className="h-2" />
      )}
      
      {download.size && (
        <div className="text-xs text-slate-400">Size: {download.size}</div>
      )}
      
      {download.error && (
        <div className="text-xs text-red-400">Error: {download.error}</div>
      )}
    </div>
  );
};

export default DownloadItem;
