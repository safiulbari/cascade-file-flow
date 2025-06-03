
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface DownloadStatus {
  id: string;
  filename: string;
  status: 'queued' | 'downloading' | 'completed' | 'failed' | 'paused';
  progress?: number;
  size?: string;
  error?: string;
}

interface DownloadSummary {
  totalFiles: number;
  completedFiles: number;
  failedFiles: number;
  totalSize: string;
  duration: string;
}

interface MacOSSidebarProps {
  downloads: DownloadStatus[];
  summary: DownloadSummary | null;
}

const MacOSSidebar: React.FC<MacOSSidebarProps> = ({ downloads, summary }) => {
  const downloadingCount = downloads.filter(d => d.status === 'downloading').length;
  const completedCount = downloads.filter(d => d.status === 'completed').length;
  const failedCount = downloads.filter(d => d.status === 'failed').length;
  const pausedCount = downloads.filter(d => d.status === 'paused').length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'downloading':
        return <Download className="h-4 w-4 text-blue-600" />;
      case 'paused':
        return <Clock className="h-4 w-4 text-orange-600" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-300 flex flex-col">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Downloads</h2>
      </div>

      {/* Statistics */}
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="text-lg font-bold text-blue-600">{downloads.length}</div>
            <div className="text-xs text-gray-600">Total</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="text-lg font-bold text-green-600">{completedCount}</div>
            <div className="text-xs text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="text-lg font-bold text-orange-600">{pausedCount}</div>
            <div className="text-xs text-gray-600">Paused</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="text-lg font-bold text-red-600">{failedCount}</div>
            <div className="text-xs text-gray-600">Failed</div>
          </div>
        </div>
      </div>

      {/* Recent Downloads */}
      <div className="flex-1 p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Recent Downloads</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {downloads.slice(-10).reverse().map((download) => (
            <div key={download.id} className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex items-center space-x-2 mb-2">
                {getStatusIcon(download.status)}
                <span className="text-sm font-medium text-gray-800 truncate flex-1">
                  {download.filename}
                </span>
              </div>
              {download.progress !== undefined && download.status !== 'completed' && (
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-blue-500 h-1.5 rounded-full transition-all duration-300" 
                    style={{ width: `${download.progress}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="p-4 border-t border-gray-200 bg-green-50">
          <div className="text-sm font-medium text-green-800 mb-1">
            Download Complete!
          </div>
          <div className="text-xs text-green-600">
            {summary.completedFiles}/{summary.totalFiles} files • {summary.totalSize}
          </div>
        </div>
      )}
    </div>
  );
};

export default MacOSSidebar;
