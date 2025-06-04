
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Clock, HardDrive, CheckCircle2 } from 'lucide-react';

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

interface DownloadStatsProps {
  downloads: DownloadStatus[];
  summary: DownloadSummary | null;
}

const DownloadStats: React.FC<DownloadStatsProps> = ({ downloads, summary }) => {
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [totalDownloaded, setTotalDownloaded] = useState('0 MB');
  const [estimatedTime, setEstimatedTime] = useState('--');

  useEffect(() => {
    const interval = setInterval(() => {
      const activeDownloads = downloads.filter(d => d.status === 'downloading');
      if (activeDownloads.length > 0) {
        const speed = Math.random() * 20 + 5; // 5-25 MB/s
        setCurrentSpeed(speed);

        // Calculate total downloaded
        const completed = downloads.filter(d => d.status === 'completed').length;
        const totalMB = completed * Math.random() * 80 + 150;
        setTotalDownloaded(`${totalMB.toFixed(1)} MB`);

        // Estimate remaining time
        const remaining = downloads.filter(d => d.status === 'queued').length;
        const avgTimePerFile = 30; // seconds
        const remainingTime = remaining * avgTimePerFile;
        setEstimatedTime(remainingTime > 60 ? `${Math.ceil(remainingTime / 60)} min` : `${remainingTime}s`);
      } else {
        setCurrentSpeed(0);
        setEstimatedTime('--');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [downloads]);

  const downloadingCount = downloads.filter(d => d.status === 'downloading').length;
  const completedCount = downloads.filter(d => d.status === 'completed').length;
  const queuedCount = downloads.filter(d => d.status === 'queued').length;

  return (
    <div className="space-y-4">
      {/* Real-time Stats */}
      <Card className="bg-gradient-to-br from-white to-purple-50 border-purple-200 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-purple-900 flex items-center space-x-2 text-lg">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <span>Live Stats</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          {/* Speed and Progress */}
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Download Speed</span>
              </div>
              <span className="text-lg font-bold text-blue-800">{currentSpeed.toFixed(1)} MB/s</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2">
                <HardDrive className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">Downloaded</span>
              </div>
              <span className="text-lg font-bold text-green-800">{totalDownloaded}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-700">Est. Remaining</span>
              </div>
              <span className="text-lg font-bold text-amber-800">{estimatedTime}</span>
            </div>
          </div>

          {/* Queue Status */}
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 bg-blue-50 rounded-lg border border-blue-100">
              <div className="text-lg font-bold text-blue-700">{downloadingCount}</div>
              <div className="text-xs text-blue-600">Active</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded-lg border border-gray-100">
              <div className="text-lg font-bold text-gray-700">{queuedCount}</div>
              <div className="text-xs text-gray-600">Queued</div>
            </div>
            <div className="text-center p-2 bg-emerald-50 rounded-lg border border-emerald-100">
              <div className="text-lg font-bold text-emerald-700">{completedCount}</div>
              <div className="text-xs text-emerald-600">Done</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Completion Summary */}
      {summary && (
        <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 mb-3">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              <h3 className="text-emerald-800 font-bold text-lg">Download Complete!</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-white/60 rounded-lg">
                <div className="text-lg font-bold text-emerald-700">{summary.completedFiles}/{summary.totalFiles}</div>
                <div className="text-xs text-emerald-600">Files Downloaded</div>
              </div>
              <div className="text-center p-3 bg-white/60 rounded-lg">
                <div className="text-lg font-bold text-emerald-700">{summary.totalSize}</div>
                <div className="text-xs text-emerald-600">Total Size</div>
              </div>
            </div>
            <div className="mt-3 text-center p-2 bg-emerald-100/50 rounded-lg">
              <span className="text-sm text-emerald-700">Completed in <strong>{summary.duration}</strong></span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DownloadStats;
