
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DownloadStatus {
  id: string;
  filename: string;
  status: 'queued' | 'downloading' | 'completed' | 'failed';
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

interface DownloadStatsProps {
  downloads: DownloadStatus[];
  summary: DownloadSummary | null;
}

const DownloadStats: React.FC<DownloadStatsProps> = ({ downloads, summary }) => {
  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900 flex items-center justify-between">
          <span>Statistics</span>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded">Network</button>
            <button className="px-3 py-1 text-xs bg-green-100 text-green-600 rounded">Disk</button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{downloads.length}</div>
            <div className="text-sm text-gray-600">Total Files</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {downloads.filter(d => d.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {downloads.filter(d => d.status === 'downloading').length}
            </div>
            <div className="text-sm text-gray-600">Downloading</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {downloads.filter(d => d.status === 'failed').length}
            </div>
            <div className="text-sm text-gray-600">Failed</div>
          </div>
        </div>

        {summary && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-green-700 font-semibold mb-2">Download Complete!</h3>
            <div className="space-y-1 text-sm text-green-600">
              <div>Files: {summary.completedFiles}/{summary.totalFiles}</div>
              <div>Total Size: {summary.totalSize}</div>
              <div>Duration: {summary.duration}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DownloadStats;
