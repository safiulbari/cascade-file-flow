
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
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Statistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-slate-700 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">{downloads.length}</div>
            <div className="text-sm text-slate-300">Total Files</div>
          </div>
          <div className="text-center p-3 bg-slate-700 rounded-lg">
            <div className="text-2xl font-bold text-green-400">
              {downloads.filter(d => d.status === 'completed').length}
            </div>
            <div className="text-sm text-slate-300">Completed</div>
          </div>
          <div className="text-center p-3 bg-slate-700 rounded-lg">
            <div className="text-2xl font-bold text-yellow-400">
              {downloads.filter(d => d.status === 'downloading').length}
            </div>
            <div className="text-sm text-slate-300">Downloading</div>
          </div>
          <div className="text-center p-3 bg-slate-700 rounded-lg">
            <div className="text-2xl font-bold text-red-400">
              {downloads.filter(d => d.status === 'failed').length}
            </div>
            <div className="text-sm text-slate-300">Failed</div>
          </div>
        </div>

        {summary && (
          <div className="mt-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
            <h3 className="text-green-400 font-semibold mb-2">Download Complete!</h3>
            <div className="space-y-1 text-sm text-slate-300">
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
