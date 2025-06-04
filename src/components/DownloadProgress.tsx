
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Download as DownloadIcon, Clock, AlertCircle, Pause, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${variants[status as keyof typeof variants] || variants.queued}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getRealTimeData = (download: DownloadStatus) => {
    if (download.status === 'downloading' && download.startTime) {
      const elapsed = (Date.now() - download.startTime) / 1000;
      const speed = Math.random() * 15 + 2; // MB/s simulation
      const remaining = download.progress ? ((100 - download.progress) / download.progress) * elapsed : 0;
      
      return {
        speed: download.speed || `${speed.toFixed(1)} MB/s`,
        remainingTime: remaining > 0 ? `${Math.ceil(remaining / 60)} min` : 'Calculating...'
      };
    }
    return { speed: download.speed || '--', remainingTime: '--' };
  };

  return (
    <div className="space-y-6">
      {/* Overall Progress Summary */}
      <Card className="bg-gradient-to-br from-white to-indigo-50 border-indigo-200 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-indigo-900 flex items-center space-x-2 text-lg">
            <DownloadIcon className="h-5 w-5 text-indigo-600" />
            <span>Download Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center p-3 bg-blue-50 rounded-xl border border-blue-200">
              <div className="text-xl font-bold text-blue-700">{downloads.length}</div>
              <div className="text-xs text-blue-600 font-medium">Total</div>
            </div>
            <div className="text-center p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="text-xl font-bold text-emerald-700">{completedCount}</div>
              <div className="text-xs text-emerald-600 font-medium">Completed</div>
            </div>
            <div className="text-center p-3 bg-amber-50 rounded-xl border border-amber-200">
              <div className="text-xl font-bold text-amber-700">{queuedCount}</div>
              <div className="text-xs text-amber-600 font-medium">Queued</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-xl border border-red-200">
              <div className="text-xl font-bold text-red-700">{failedCount}</div>
              <div className="text-xs text-red-600 font-medium">Failed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Download Highlight */}
      {activeDownload && (
        <Card className={`shadow-lg border-2 ${
          activeDownload.status === 'paused' 
            ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300' 
            : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300'
        }`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getStatusIcon(activeDownload.status)}
                <div>
                  <h3 className="font-semibold text-gray-900 truncate max-w-md">
                    {activeDownload.filename}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {activeDownload.status === 'paused' ? 'Download Paused' : getRealTimeData(activeDownload).speed}
                  </p>
                </div>
              </div>
              {getStatusBadge(activeDownload.status)}
            </div>
            
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ease-out ${
                    activeDownload.status === 'paused' 
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500' 
                      : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                  }`}
                  style={{ width: `${activeDownload.progress || 0}%` }}
                />
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">{activeDownload.progress || 0}%</span>
                <span className="text-gray-600">
                  {activeDownload.status === 'paused' 
                    ? 'Paused - Click Resume to continue' 
                    : `${getRealTimeData(activeDownload).remainingTime} remaining`
                  }
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Downloads List */}
      <Card className="bg-white border border-gray-200 shadow-lg">
        <CardHeader className="pb-4 border-b border-gray-100">
          <CardTitle className="text-gray-900 text-lg">All Downloads</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-96 overflow-y-auto">
            {downloads.map((download, index) => {
              const realTimeData = getRealTimeData(download);
              return (
                <div 
                  key={download.id} 
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50/50 transition-colors ${
                    index === downloads.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      {getStatusIcon(download.status)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate" title={download.filename}>
                          {download.filename}
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          {(download.status === 'downloading' || download.status === 'paused') && download.progress !== undefined && (
                            <div className="flex items-center space-x-2">
                              <div className="w-20 bg-gray-200 rounded-full h-1.5">
                                <div 
                                  className={`h-1.5 rounded-full transition-all duration-300 ${
                                    download.status === 'completed' ? 'bg-emerald-500' :
                                    download.status === 'downloading' ? 'bg-blue-500' :
                                    download.status === 'paused' ? 'bg-amber-500' :
                                    download.status === 'failed' ? 'bg-red-500' :
                                    'bg-gray-300'
                                  }`}
                                  style={{ width: `${download.status === 'completed' ? 100 : download.progress || 0}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-500 w-8 text-right">
                                {download.status === 'completed' ? '100%' : `${download.progress || 0}%`}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center space-x-3 text-xs text-gray-500">
                            {download.size && <span>{download.size}</span>}
                            {download.status === 'downloading' && (
                              <span className="font-mono text-blue-600">{realTimeData.speed}</span>
                            )}
                          </div>
                        </div>
                        {download.error && (
                          <p className="text-xs text-red-500 mt-1">Error: {download.error}</p>
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      {getStatusBadge(download.status)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DownloadProgress;
