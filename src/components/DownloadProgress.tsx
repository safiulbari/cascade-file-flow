
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download as DownloadIcon, Clock, AlertCircle, Pause, Play } from 'lucide-react';

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
  onPause: (id: string) => void;
  onResume: (id: string) => void;
}

const DownloadProgress: React.FC<DownloadProgressProps> = ({ downloads, onPause, onResume }) => {
  const activeDownload = downloads.find(d => d.status === 'downloading');
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'downloading':
        return <DownloadIcon className="h-4 w-4 text-blue-400" />;
      case 'paused':
        return <Pause className="h-4 w-4 text-orange-400" />;
      case 'queued':
        return <Clock className="h-4 w-4 text-gray-400" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-400';
      case 'downloading':
        return 'bg-blue-400';
      case 'paused':
        return 'bg-orange-400';
      case 'failed':
        return 'bg-red-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'downloading':
        return 'Downloading';
      case 'paused':
        return 'Paused';
      case 'queued':
        return 'Queued';
      case 'failed':
        return 'Failed';
      default:
        return 'Pending';
    }
  };

  return (
    <div className="space-y-4">
      {/* Current Download Summary */}
      {activeDownload && (
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium text-white/90 truncate max-w-md">
              {activeDownload.filename}
            </h3>
            <div className="flex items-center space-x-2">
              <div className="text-sm font-medium text-white/70">
                {activeDownload.speed || '--'}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onPause(activeDownload.id)}
                className="h-7 w-7 p-0 bg-white/5 border-white/20 hover:bg-white/10 text-white"
              >
                <Pause className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <div className="w-full bg-white/10 rounded-full h-2 mb-2">
            <div 
              className="bg-blue-400 h-2 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${activeDownload.progress || 0}%` }}
            />
          </div>
          
          <div className="flex justify-between text-sm text-white/70">
            <span className="font-medium">{activeDownload.progress || 0}%</span>
            <span>{activeDownload.remainingTime || 'Calculating...'}</span>
          </div>
        </div>
      )}

      {/* Downloads List */}
      <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <h3 className="text-white/90 flex items-center space-x-2 font-medium">
            <DownloadIcon className="h-5 w-5 text-white/70" />
            <span>Downloads</span>
            <span className="text-sm font-normal text-white/50">({downloads.length})</span>
          </h3>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {downloads.map((download, index) => (
            <div key={download.id} className={`p-3 border-b border-white/5 hover:bg-white/5 transition-colors ${index === downloads.length - 1 ? 'border-b-0' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {getStatusIcon(download.status)}
                  <span className="text-white/90 truncate text-sm font-medium">
                    {download.filename}
                  </span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-white/10 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full transition-all duration-300 ${getProgressColor(download.status)}`}
                        style={{ width: `${download.status === 'completed' ? 100 : download.progress || 0}%` }}
                      />
                    </div>
                    <span className="text-xs text-white/60 w-10 text-right">
                      {download.status === 'completed' ? '100%' : `${download.progress || 0}%`}
                    </span>
                  </div>
                  
                  <span className="text-xs text-white/50 w-12 text-right">
                    {download.size || '--'}
                  </span>
                  
                  <span className={`px-2 py-1 rounded-full text-xs font-medium w-20 text-center ${
                    download.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                    download.status === 'downloading' ? 'bg-blue-500/20 text-blue-300' :
                    download.status === 'paused' ? 'bg-orange-500/20 text-orange-300' :
                    download.status === 'failed' ? 'bg-red-500/20 text-red-300' :
                    'bg-gray-500/20 text-gray-300'
                  }`}>
                    {getStatusText(download.status)}
                  </span>
                  
                  <div className="w-8">
                    {download.status === 'downloading' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onPause(download.id)}
                        className="h-6 w-6 p-0 bg-white/5 border-white/20 hover:bg-white/10 text-white"
                      >
                        <Pause className="h-3 w-3" />
                      </Button>
                    )}
                    {download.status === 'paused' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onResume(download.id)}
                        className="h-6 w-6 p-0 bg-white/5 border-white/20 hover:bg-white/10 text-white"
                      >
                        <Play className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DownloadProgress;
