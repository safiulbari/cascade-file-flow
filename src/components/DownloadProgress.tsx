
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Download as DownloadIcon, Clock, AlertCircle } from 'lucide-react';
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
        return <CheckCircle className="h-4 w-4 text-purple-600" />;
      case 'downloading':
        return <DownloadIcon className="h-4 w-4 text-green-600" />;
      case 'queued':
        return <Clock className="h-4 w-4 text-gray-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-purple-500';
      case 'downloading':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
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
        remainingTime: remaining > 0 ? `${Math.ceil(remaining / 60)} min` : 'Calculating...'
      };
    }
    return { speed: '--', remainingTime: '--' };
  };

  return (
    <div className="space-y-6">
      {/* Current Download Summary */}
      {activeDownload && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 truncate max-w-md">
                {activeDownload.filename}
              </h3>
              <div className="text-sm font-medium text-blue-600">
                {getRealTimeData(activeDownload).speed}
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${activeDownload.progress || 0}%` }}
              />
            </div>
            
            <div className="flex justify-between text-sm text-gray-600">
              <span className="font-medium">{activeDownload.progress || 0}%</span>
              <span>{getRealTimeData(activeDownload).remainingTime} remaining</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Downloads Table */}
      <Card className="bg-white border border-gray-200 shadow-lg">
        <CardHeader className="pb-4 border-b border-gray-100">
          <CardTitle className="text-gray-900 flex items-center space-x-2">
            <DownloadIcon className="h-5 w-5 text-gray-600" />
            <span>Download Progress</span>
            <span className="text-sm font-normal text-gray-500">({downloads.length} files)</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200 bg-gray-50">
                <TableHead className="text-gray-700 font-semibold w-[40%]">File Name</TableHead>
                <TableHead className="text-gray-700 font-semibold w-[15%]">Progress</TableHead>
                <TableHead className="text-gray-700 font-semibold w-[10%]">Size</TableHead>
                <TableHead className="text-gray-700 font-semibold w-[15%] text-center">Speed</TableHead>
                <TableHead className="text-gray-700 font-semibold w-[20%]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {downloads.map((download) => {
                const realTimeData = getRealTimeData(download);
                return (
                  <TableRow key={download.id} className="border-gray-100 hover:bg-gray-50/50">
                    <TableCell className="font-medium text-gray-900 w-[40%]">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(download.status)}
                        <span className="truncate max-w-xs">{download.filename}</span>
                      </div>
                    </TableCell>
                    <TableCell className="w-[15%]">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(download.status)}`}
                            style={{ width: `${download.status === 'completed' ? 100 : download.progress || 0}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 min-w-[35px] text-right">
                          {download.status === 'completed' ? '100%' : `${download.progress || 0}%`}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600 w-[10%]">
                      <span className="text-sm">{download.size || '--'}</span>
                    </TableCell>
                    <TableCell className="text-gray-600 w-[15%] text-center">
                      <span className="text-sm font-mono min-w-[80px] inline-block">
                        {download.status === 'downloading' ? realTimeData.speed : '--'}
                      </span>
                    </TableCell>
                    <TableCell className="w-[20%]">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
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
    </div>
  );
};

export default DownloadProgress;
