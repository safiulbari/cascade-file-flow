
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Clock, Loader2, Pause, Play, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DownloadStatus {
  id: string;
  filename: string;
  status: 'queued' | 'downloading' | 'completed' | 'failed' | 'paused';
  progress?: number;
  size?: string;
  error?: string;
  speed?: string;
  remainingTime?: string;
  startTime?: number;
}

interface DownloadQueueProps {
  downloads: DownloadStatus[];
  onPauseItem?: (id: string) => void;
  onResumeItem?: (id: string) => void;
  onCancelItem?: (id: string) => void;
}

const DownloadQueue: React.FC<DownloadQueueProps> = ({ 
  downloads, 
  onPauseItem, 
  onResumeItem, 
  onCancelItem 
}) => {
  const getStatusIcon = (status: string) => {
    const iconClasses = "h-4 w-4";
    switch (status) {
      case 'completed':
        return <CheckCircle className={`${iconClasses} text-emerald-500`} />;
      case 'downloading':
        return <Loader2 className={`${iconClasses} text-blue-500 animate-spin`} />;
      case 'paused':
        return <Pause className={`${iconClasses} text-amber-500`} />;
      case 'queued':
        return <Clock className={`${iconClasses} text-gray-500`} />;
      case 'failed':
        return <AlertCircle className={`${iconClasses} text-red-500`} />;
      default:
        return <Clock className={`${iconClasses} text-gray-500`} />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'completed': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'downloading': 'bg-blue-100 text-blue-700 border-blue-200',
      'paused': 'bg-amber-100 text-amber-700 border-amber-200',
      'queued': 'bg-gray-100 text-gray-600 border-gray-200',
      'failed': 'bg-red-100 text-red-700 border-red-200'
    };
    
    return (
      <Badge className={`${variants[status as keyof typeof variants] || variants.queued} text-xs`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-gray-900 dark:text-white text-lg flex items-center justify-between">
          Download Queue
          <Badge variant="outline" className="text-xs">
            {downloads.length} items
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-96 overflow-y-auto">
          {downloads.map((download, index) => (
            <div 
              key={download.id} 
              className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                index === downloads.length - 1 ? 'border-b-0' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {getStatusIcon(download.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate" title={download.filename}>
                      {download.filename}
                    </p>
                    {download.size && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">{download.size}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(download.status)}
                  {(download.status === 'downloading' || download.status === 'paused') && (
                    <div className="flex space-x-1">
                      {download.status === 'downloading' && onPauseItem && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onPauseItem(download.id)}
                          className="h-6 w-6 p-0"
                        >
                          <Pause className="h-3 w-3" />
                        </Button>
                      )}
                      {download.status === 'paused' && onResumeItem && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onResumeItem(download.id)}
                          className="h-6 w-6 p-0"
                        >
                          <Play className="h-3 w-3" />
                        </Button>
                      )}
                      {onCancelItem && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onCancelItem(download.id)}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {(download.status === 'downloading' || download.status === 'paused') && download.progress !== undefined && (
                <div className="space-y-2">
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ease-out ${
                        download.status === 'paused' 
                          ? 'bg-gradient-to-r from-amber-400 to-orange-500' 
                          : 'bg-gradient-to-r from-blue-500 to-purple-600'
                      }`}
                      style={{ width: `${download.progress || 0}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>{download.progress || 0}%</span>
                    <div className="flex space-x-2">
                      {download.speed && <span>{download.speed}</span>}
                      {download.remainingTime && <span>• {download.remainingTime}</span>}
                    </div>
                  </div>
                </div>
              )}

              {download.error && (
                <p className="text-xs text-red-500 mt-2 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                  {download.error}
                </p>
              )}
            </div>
          ))}
          
          {downloads.length === 0 && (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
              <p className="text-sm">No downloads in queue</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DownloadQueue;
