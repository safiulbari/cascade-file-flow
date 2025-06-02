
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Pause, Download as DownloadIcon, Clock } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface DownloadStatus {
  id: string;
  filename: string;
  status: 'queued' | 'downloading' | 'completed' | 'failed';
  progress?: number;
  size?: string;
  error?: string;
}

interface DownloadProgressProps {
  downloads: DownloadStatus[];
}

const DownloadProgress: React.FC<DownloadProgressProps> = ({ downloads }) => {
  const activeDownload = downloads.find(d => d.status === 'downloading');
  const completedFiles = downloads.filter(d => d.status === 'completed').length;
  const totalFiles = downloads.length;
  
  const getStatusIcon = (status: string, progress?: number) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-purple-500" />;
      case 'downloading':
        return <DownloadIcon className="h-4 w-4 text-green-500" />;
      case 'queued':
      case 'failed':
        return <Pause className="h-4 w-4 text-gray-400" />;
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

  const getStatusText = (status: string, progress?: number) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'downloading':
        return 'Downloading';
      case 'queued':
        return 'In queue';
      case 'failed':
        return 'Failed';
      default:
        return 'Pending';
    }
  };

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <DownloadIcon className="h-5 w-5 text-gray-600" />
            <CardTitle className="text-gray-900">Downloading</CardTitle>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
              Share
            </button>
            <button className="px-3 py-1 text-sm bg-black text-white rounded hover:bg-gray-800">
              Upload
            </button>
          </div>
        </div>

        {activeDownload && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Pause className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-medium text-gray-900">{activeDownload.filename}</h3>
              </div>
            </div>
            
            <div className="text-sm text-gray-500">
              {activeDownload.progress ? Math.round((activeDownload.progress / 100) * parseFloat(activeDownload.size || '0')) : 0} of {activeDownload.size} downloaded
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${activeDownload.progress || 0}%` }}
              />
            </div>
            
            <div className="flex justify-between text-sm text-gray-500">
              <span>{activeDownload.progress || 0}%</span>
              <span>692 KB/s • 12 minutes remaining</span>
            </div>

            {/* Speed Chart Placeholder */}
            <div className="mt-4 h-32 bg-gray-50 rounded-lg flex items-end justify-center space-x-1 p-4">
              {Array.from({ length: 50 }, (_, i) => (
                <div
                  key={i}
                  className="bg-gray-300 w-1 rounded-t"
                  style={{ 
                    height: `${Math.random() * 80 + 20}%`,
                    backgroundColor: i > 25 ? '#10b981' : '#d1d5db'
                  }}
                />
              ))}
              <div className="absolute inset-0 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path
                    d="M0,80 Q25,60 50,50 T100,30"
                    stroke="#10b981"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>
            </div>

            <div className="flex justify-between text-xs text-gray-500">
              <span>0 Mb/s</span>
              <span>5 Mb/s</span>
              <span>10 Mb/s</span>
              <span>15 Mb/s</span>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200">
              <TableHead className="text-gray-600 font-medium">Name</TableHead>
              <TableHead className="text-gray-600 font-medium">Progress</TableHead>
              <TableHead className="text-gray-600 font-medium">User</TableHead>
              <TableHead className="text-gray-600 font-medium">Size</TableHead>
              <TableHead className="text-gray-600 font-medium">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {downloads.map((download, index) => (
              <TableRow key={download.id} className="border-gray-100">
                <TableCell className="font-medium text-gray-900">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(download.status, download.progress)}
                    <span>{download.filename}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {download.status === 'downloading' ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-1">
                        <div 
                          className={`h-1 rounded-full ${getProgressColor(download.status)}`}
                          style={{ width: `${download.progress || 0}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{download.progress || 0}%</span>
                    </div>
                  ) : download.status === 'completed' ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-purple-500 rounded-full h-1" />
                      <span className="text-sm text-purple-600">Completed</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-1" />
                      <span className="text-sm text-gray-500">0%</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-600">
                    {String.fromCharCode(65 + (index % 6))}
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">{download.size || 'Unknown'}</TableCell>
                <TableCell className="text-gray-600">
                  {download.status === 'completed' 
                    ? '43 minutes ago' 
                    : getStatusText(download.status, download.progress)
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-4 text-center">
          <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center space-x-1">
            <span>More details</span>
            <span>→</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DownloadProgress;
