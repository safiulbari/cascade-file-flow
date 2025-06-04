
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Download as DownloadIcon, Clock, AlertCircle, Pause, Activity, FileText, Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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

interface DownloadProgressProps {
  downloads: DownloadStatus[];
}

const DownloadProgress: React.FC<DownloadProgressProps> = ({ downloads }) => {
  const activeDownload = downloads.find(d => d.status === 'downloading' || d.status === 'paused');
  const completedCount = downloads.filter(d => d.status === 'completed').length;
  const failedCount = downloads.filter(d => d.status === 'failed').length;
  const queuedCount = downloads.filter(d => d.status === 'queued').length;
  const totalProgress = downloads.length > 0 ? (completedCount / downloads.length) * 100 : 0;
  
  const getStatusIcon = (status: string) => {
    const iconClasses = "h-4 w-4";
    switch (status) {
      case 'completed':
        return <CheckCircle className={`${iconClasses} text-emerald-600`} />;
      case 'downloading':
        return <Activity className={`${iconClasses} text-blue-600 animate-pulse`} />;
      case 'paused':
        return <Pause className={`${iconClasses} text-amber-600`} />;
      case 'queued':
        return <Clock className={`${iconClasses} text-gray-500`} />;
      case 'failed':
        return <AlertCircle className={`${iconClasses} text-red-500`} />;
      default:
        return <FileText className={`${iconClasses} text-gray-500`} />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'completed': 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300',
      'downloading': 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300',
      'paused': 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300',
      'queued': 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-300',
      'failed': 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300'
    };
    
    return (
      <Badge className={`text-xs border ${variants[status as keyof typeof variants] || variants.queued}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getRealTimeData = (download: DownloadStatus) => {
    if (download.status === 'downloading' && download.startTime) {
      const elapsed = (Date.now() - download.startTime) / 1000;
      const speed = Math.random() * 15 + 2;
      const remaining = download.progress ? ((100 - download.progress) / download.progress) * elapsed : 0;
      
      return {
        speed: download.speed || `${speed.toFixed(1)} MB/s`,
        remainingTime: remaining > 0 ? `${Math.ceil(remaining / 60)} min` : 'Calculating...'
      };
    }
    return { speed: download.speed || '--', remainingTime: '--' };
  };

  return (
    <div className="space-y-4">
      {/* Overall Progress Summary */}
      <Card className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 border-blue-200 dark:border-blue-700 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center justify-between text-lg">
            <div className="flex items-center space-x-2">
              <DownloadIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span>Download Progress</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {completedCount}/{downloads.length} completed
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          {/* Overall Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300 font-medium">Overall Progress</span>
              <span className="text-blue-600 dark:text-blue-400 font-bold">{totalProgress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div 
                className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-1000 ease-out"
                style={{ width: `${totalProgress}%` }}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-700">
              <div className="text-xl font-bold text-blue-700 dark:text-blue-300">{downloads.length}</div>
              <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Total</div>
            </div>
            <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl border border-emerald-200 dark:border-emerald-700">
              <div className="text-xl font-bold text-emerald-700 dark:text-emerald-300">{completedCount}</div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Done</div>
            </div>
            <div className="text-center p-3 bg-amber-50 dark:bg-amber-900/30 rounded-xl border border-amber-200 dark:border-amber-700">
              <div className="text-xl font-bold text-amber-700 dark:text-amber-300">{queuedCount}</div>
              <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">Queue</div>
            </div>
            <div className="text-center p-3 bg-red-50 dark:bg-red-900/30 rounded-xl border border-red-200 dark:border-red-700">
              <div className="text-xl font-bold text-red-700 dark:text-red-300">{failedCount}</div>
              <div className="text-xs text-red-600 dark:text-red-400 font-medium">Failed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Download Highlight */}
      {activeDownload && (
        <Card className={`shadow-lg border-2 transition-all duration-300 ${
          activeDownload.status === 'paused' 
            ? 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-300 dark:border-amber-600' 
            : 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-300 dark:border-blue-600'
        }`}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getStatusIcon(activeDownload.status)}
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white truncate max-w-md text-base">
                    {activeDownload.filename}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {activeDownload.status === 'paused' ? 'Download Paused' : getRealTimeData(activeDownload).speed}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge(activeDownload.status)}
                {activeDownload.status === 'paused' && (
                  <Button size="sm" variant="outline" className="h-8 px-3">
                    <Play className="h-3 w-3 mr-1" />
                    Resume
                  </Button>
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ease-out ${
                    activeDownload.status === 'paused' 
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500' 
                      : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                  }`}
                  style={{ width: `${activeDownload.progress || 0}%` }}
                />
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-gray-700 dark:text-gray-300">{activeDownload.progress || 0}%</span>
                  {activeDownload.size && (
                    <span className="text-gray-500 dark:text-gray-400">• {activeDownload.size}</span>
                  )}
                </div>
                <span className="text-gray-600 dark:text-gray-400">
                  {activeDownload.status === 'paused' 
                    ? 'Paused' 
                    : `${getRealTimeData(activeDownload).remainingTime} left`
                  }
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Downloads List */}
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
        <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-700">
          <CardTitle className="text-gray-900 dark:text-white text-lg flex items-center justify-between">
            Downloads Queue
            <Badge variant="outline">{downloads.length} items</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-80 overflow-y-auto">
            {downloads.map((download, index) => {
              const realTimeData = getRealTimeData(download);
              return (
                <div 
                  key={download.id} 
                  className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                    index === downloads.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      {getStatusIcon(download.status)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate" title={download.filename}>
                          {download.filename}
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          {(download.status === 'downloading' || download.status === 'paused') && download.progress !== undefined && (
                            <div className="flex items-center space-x-2">
                              <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                                <div 
                                  className={`h-1.5 rounded-full transition-all duration-300 ${
                                    download.status === 'downloading' ? 'bg-blue-500' :
                                    download.status === 'paused' ? 'bg-amber-500' :
                                    'bg-gray-300'
                                  }`}
                                  style={{ width: `${download.progress || 0}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-500 dark:text-gray-400 w-10 text-right font-mono">
                                {download.progress || 0}%
                              </span>
                            </div>
                          )}
                          <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                            {download.size && <span className="font-mono">{download.size}</span>}
                            {download.status === 'downloading' && (
                              <span className="font-mono text-blue-600 dark:text-blue-400">{realTimeData.speed}</span>
                            )}
                          </div>
                        </div>
                        {download.error && (
                          <p className="text-xs text-red-500 mt-2 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                            Error: {download.error}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="ml-3">
                      {getStatusBadge(download.status)}
                    </div>
                  </div>
                </div>
              );
            })}
            {downloads.length === 0 && (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <DownloadIcon className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                <p className="text-lg font-medium mb-1">No downloads yet</p>
                <p className="text-sm">Start by entering a directory URL above</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DownloadProgress;
