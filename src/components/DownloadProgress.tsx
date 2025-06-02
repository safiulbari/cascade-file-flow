
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Download as DownloadIcon, Clock, Pause } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface DownloadStatus {
  id: string;
  filename: string;
  status: 'queued' | 'downloading' | 'completed' | 'failed';
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
  const activeDownload = downloads.find(d => d.status === 'downloading');
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-purple-500" />;
      case 'downloading':
        return <DownloadIcon className="h-4 w-4 text-green-500" />;
      case 'queued':
        return <Clock className="h-4 w-4 text-gray-400" />;
      case 'failed':
        return <Pause className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-purple-500';
      case 'downloading':
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'downloading':
        return 'Downloading';
      case 'queued':
        return 'Queued';
      case 'failed':
        return 'Failed';
      default:
        return 'Pending';
    }
  };

  const getRealTimeData = (download: DownloadStatus) => {
    if (download.status === 'downloading' && download.startTime) {
      const elapsed = (Date.now() - download.startTime) / 1000;
      const speed = Math.random() * 10 + 1; // MB/s
      const remaining = download.progress ? ((100 - download.progress) / download.progress) * elapsed : 0;
      
      return {
        speed: `${speed.toFixed(1)} MB/s`,
        remainingTime: remaining > 0 ? `${Math.ceil(remaining / 60)} min` : 'Calculating...',
        elapsedTime: `${Math.floor(elapsed / 60)}:${Math.floor(elapsed % 60).toString().padStart(2, '0')}`
      };
    }
    return { speed: '0 MB/s', remainingTime: '--', elapsedTime: '--' };
  };

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-gray-900 flex items-center space-x-2">
          <DownloadIcon className="h-5 w-5 text-gray-600" />
          <span>Downloads</span>
        </CardTitle>

        {activeDownload && (
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">{activeDownload.filename}</h3>
              <div className="text-sm text-gray-500">
                {getRealTimeData(activeDownload).speed}
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${activeDownload.progress || 0}%` }}
              />
            </div>
            
            <div className="flex justify-between text-sm text-gray-500">
              <span>{activeDownload.progress || 0}%</span>
              <span>{getRealTimeData(activeDownload).remainingTime} remaining</span>
            </div>

            {/* Real-time Speed Graph */}
            <div className="mt-4 h-32 bg-gray-50 rounded-lg flex items-end justify-center space-x-1 p-4 relative">
              {Array.from({ length: 50 }, (_, i) => {
                const height = Math.random() * 80 + 20;
                const isRecent = i > 35;
                return (
                  <div
                    key={i}
                    className="w-1 rounded-t transition-all duration-200"
                    style={{ 
                      height: `${height}%`,
                      backgroundColor: isRecent ? '#10b981' : '#d1d5db'
                    }}
                  />
                );
              })}
            </div>

            <div className="flex justify-between text-xs text-gray-500">
              <span>0 MB/s</span>
              <span>5 MB/s</span>
              <span>10 MB/s</span>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200">
              <TableHead className="text-gray-600 font-medium">File Name</TableHead>
              <TableHead className="text-gray-600 font-medium">Progress</TableHead>
              <TableHead className="text-gray-600 font-medium">Size</TableHead>
              <TableHead className="text-gray-600 font-medium">Speed</TableHead>
              <TableHead className="text-gray-600 font-medium">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {downloads.map((download) => {
              const realTimeData = getRealTimeData(download);
              return (
                <TableRow key={download.id} className="border-gray-100">
                  <TableCell className="font-medium text-gray-900">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(download.status)}
                      <span className="truncate max-w-xs">{download.filename}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(download.status)}`}
                          style={{ width: `${download.progress || 0}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 min-w-[40px]">
                        {download.status === 'completed' ? '100%' : `${download.progress || 0}%`}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">{download.size || 'Unknown'}</TableCell>
                  <TableCell className="text-gray-600">
                    {download.status === 'downloading' ? realTimeData.speed : '--'}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      download.status === 'completed' ? 'bg-purple-100 text-purple-700' :
                      download.status === 'downloading' ? 'bg-green-100 text-green-700' :
                      download.status === 'failed' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {getStatusText(download.status)}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default DownloadProgress;
