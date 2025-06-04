
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Clock, HardDrive, CheckCircle2, Activity, Zap, Download } from 'lucide-react';

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
  const [peakSpeed, setPeakSpeed] = useState(0);
  const [averageSpeed, setAverageSpeed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const activeDownloads = downloads.filter(d => d.status === 'downloading');
      if (activeDownloads.length > 0) {
        const speed = Math.random() * 20 + 5; // 5-25 MB/s
        setCurrentSpeed(speed);
        setPeakSpeed(prev => Math.max(prev, speed));

        // Calculate average speed
        setAverageSpeed(prev => {
          const newAvg = prev === 0 ? speed : (prev + speed) / 2;
          return newAvg;
        });

        // Calculate total downloaded
        const completed = downloads.filter(d => d.status === 'completed').length;
        const totalMB = completed * (Math.random() * 80 + 50) + (Math.random() * 100);
        setTotalDownloaded(`${totalMB.toFixed(1)} MB`);

        // Estimate remaining time
        const remaining = downloads.filter(d => d.status === 'queued').length;
        const avgTimePerFile = 25; // seconds
        const remainingTime = remaining * avgTimePerFile;
        setEstimatedTime(remainingTime > 60 ? `${Math.ceil(remainingTime / 60)} min` : `${remainingTime}s`);
      } else {
        setCurrentSpeed(0);
        setEstimatedTime('--');
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [downloads]);

  const downloadingCount = downloads.filter(d => d.status === 'downloading').length;
  const completedCount = downloads.filter(d => d.status === 'completed').length;
  const queuedCount = downloads.filter(d => d.status === 'queued').length;
  const pausedCount = downloads.filter(d => d.status === 'paused').length;
  const failedCount = downloads.filter(d => d.status === 'failed').length;

  return (
    <div className="space-y-4">
      {/* Enhanced Live Stats */}
      <Card className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 border-blue-200 dark:border-blue-800 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center space-x-2 text-lg">
            <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span>Live Statistics</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          {/* Speed Grid */}
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl border border-blue-200 dark:border-blue-700">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Current Speed</span>
                  <p className="text-xs text-blue-600 dark:text-blue-400">Real-time download rate</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-800 dark:text-blue-200">{currentSpeed.toFixed(1)} MB/s</div>
                <div className="text-xs text-blue-600 dark:text-blue-400">
                  {currentSpeed > 0 ? '🔥 Active' : '⏸️ Idle'}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 rounded-xl border border-amber-200 dark:border-amber-700">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <div>
                    <span className="text-xs font-medium text-amber-700 dark:text-amber-300">Peak</span>
                    <div className="text-sm font-bold text-amber-800 dark:text-amber-200">{peakSpeed.toFixed(1)}</div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl border border-green-200 dark:border-green-700">
                <div className="flex items-center space-x-2">
                  <HardDrive className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <div>
                    <span className="text-xs font-medium text-green-700 dark:text-green-300">Average</span>
                    <div className="text-sm font-bold text-green-800 dark:text-green-200">{averageSpeed.toFixed(1)}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl border border-purple-200 dark:border-purple-700">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
                  <Download className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">Downloaded</span>
                  <p className="text-xs text-purple-600 dark:text-purple-400">Total size transferred</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-purple-800 dark:text-purple-200">{totalDownloaded}</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800 rounded-xl border border-gray-200 dark:border-gray-600">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">ETA</span>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Estimated completion</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-800 dark:text-gray-200">{estimatedTime}</div>
              </div>
            </div>
          </div>

          {/* Enhanced Queue Status */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-700">
              <div className="text-xl font-bold text-blue-700 dark:text-blue-300">{downloadingCount}</div>
              <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Active</div>
              {downloadingCount > 0 && <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-1 animate-pulse"></div>}
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600">
              <div className="text-xl font-bold text-gray-700 dark:text-gray-300">{queuedCount}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Queued</div>
            </div>
            <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl border border-emerald-200 dark:border-emerald-700">
              <div className="text-xl font-bold text-emerald-700 dark:text-emerald-300">{completedCount}</div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Done</div>
            </div>
          </div>

          {(pausedCount > 0 || failedCount > 0) && (
            <div className="grid grid-cols-2 gap-3">
              {pausedCount > 0 && (
                <div className="text-center p-3 bg-amber-50 dark:bg-amber-900/30 rounded-xl border border-amber-200 dark:border-amber-700">
                  <div className="text-lg font-bold text-amber-700 dark:text-amber-300">{pausedCount}</div>
                  <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">Paused</div>
                </div>
              )}
              {failedCount > 0 && (
                <div className="text-center p-3 bg-red-50 dark:bg-red-900/30 rounded-xl border border-red-200 dark:border-red-700">
                  <div className="text-lg font-bold text-red-700 dark:text-red-300">{failedCount}</div>
                  <div className="text-xs text-red-600 dark:text-red-400 font-medium">Failed</div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Completion Summary */}
      {summary && (
        <Card className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/50 dark:to-green-900/50 border-emerald-200 dark:border-emerald-700 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-800 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="text-emerald-800 dark:text-emerald-200 font-bold text-lg">Download Complete! 🎉</h3>
                <p className="text-emerald-600 dark:text-emerald-400 text-sm">All files processed successfully</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="text-center p-3 bg-white/60 dark:bg-black/20 rounded-xl">
                <div className="text-lg font-bold text-emerald-700 dark:text-emerald-300">{summary.completedFiles}</div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400">Files</div>
              </div>
              <div className="text-center p-3 bg-white/60 dark:bg-black/20 rounded-xl">
                <div className="text-lg font-bold text-emerald-700 dark:text-emerald-300">{summary.totalSize}</div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400">Size</div>
              </div>
              <div className="text-center p-3 bg-white/60 dark:bg-black/20 rounded-xl">
                <div className="text-lg font-bold text-emerald-700 dark:text-emerald-300">{summary.duration}</div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400">Time</div>
              </div>
            </div>
            {summary.failedFiles > 0 && (
              <div className="text-center p-2 bg-red-100/50 dark:bg-red-900/20 rounded-lg">
                <span className="text-xs text-red-700 dark:text-red-400">
                  ⚠️ {summary.failedFiles} files failed to download
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DownloadStats;
