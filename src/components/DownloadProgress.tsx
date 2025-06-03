
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download as DownloadIcon, Clock, AlertCircle, Pause, Play } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'downloading':
        return <DownloadIcon className="h-4 w-4 text-blue-600" />;
      case 'paused':
        return <Pause className="h-4 w-4 text-orange-600" />;
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
        return 'bg-green-500';
      case 'downloading':
        return 'bg-blue-500';
      case 'paused':
        return 'bg-orange-500';
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
    <div className="space-y-6">
      {/* Current Download Summary */}
      {activeDownload && (
        <Card className="bg-white border border-gray-300 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 truncate max-w-md">
                {activeDownload.filename}
              </h3>
              <div className="flex items-center space-x-2">
                <div className="text-sm font-medium text-gray-600">
                  {activeDownload.speed || '--'}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onPause(activeDownload.id)}
                  className="h-8 w-8 p-0"
                >
                  <Pause className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${activeDownload.progress || 0}%` }}
              />
            </div>
            
            <div className="flex justify-between text-sm text-gray-600">
              <span className="font-medium">{activeDownload.progress || 0}%</span>
              <span>{activeDownload.remainingTime || 'Calculating...'}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Downloads Table */}
      <Card className="bg-white border border-gray-300 shadow-sm">
        <CardHeader className="pb-4 border-b border-gray-200">
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
                <TableHead className="text-gray-700 font-medium w-[35%]">File Name</TableHead>
                <TableHead className="text-gray-700 font-medium w-[20%]">Progress</TableHead>
                <TableHead className="text-gray-700 font-medium w-[15%]">Size</TableHead>
                <TableHead className="text-gray-700 font-medium w-[15%]">Status</TableHead>
                <TableHead className="text-gray-700 font-medium w-[15%]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {downloads.map((download) => (
                <TableRow key={download.id} className="border-gray-200 hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900 p-4">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(download.status)}
                      <span className="truncate max-w-xs">{download.filename}</span>
                    </div>
                  </TableCell>
                  <TableCell className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(download.status)}`}
                          style={{ width: `${download.status === 'completed' ? 100 : download.progress || 0}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">
                        {download.status === 'completed' ? '100%' : `${download.progress || 0}%`}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600 p-4">
                    <span className="text-sm">{download.size || '--'}</span>
                  </TableCell>
                  <TableCell className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      download.status === 'completed' ? 'bg-green-100 text-green-700' :
                      download.status === 'downloading' ? 'bg-blue-100 text-blue-700' :
                      download.status === 'paused' ? 'bg-orange-100 text-orange-700' :
                      download.status === 'failed' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {getStatusText(download.status)}
                    </span>
                  </TableCell>
                  <TableCell className="p-4">
                    {download.status === 'downloading' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onPause(download.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Pause className="h-3 w-3" />
                      </Button>
                    )}
                    {download.status === 'paused' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onResume(download.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Play className="h-3 w-3" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DownloadProgress;
