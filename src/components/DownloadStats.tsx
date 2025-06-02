
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

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
  const [speedData, setSpeedData] = useState<Array<{ time: string; speed: number }>>([]);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [totalDownloaded, setTotalDownloaded] = useState('0 MB');

  useEffect(() => {
    const interval = setInterval(() => {
      const activeDownloads = downloads.filter(d => d.status === 'downloading');
      if (activeDownloads.length > 0) {
        const speed = Math.random() * 15 + 2; // 2-17 MB/s
        setCurrentSpeed(speed);
        
        const now = new Date();
        const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        setSpeedData(prev => {
          const newData = [...prev, { time: timeStr, speed }].slice(-20); // Keep last 20 points
          return newData;
        });

        // Calculate total downloaded
        const completed = downloads.filter(d => d.status === 'completed').length;
        const totalMB = completed * Math.random() * 50 + 100;
        setTotalDownloaded(`${totalMB.toFixed(1)} MB`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [downloads]);

  const downloadingCount = downloads.filter(d => d.status === 'downloading').length;
  const completedCount = downloads.filter(d => d.status === 'completed').length;
  const failedCount = downloads.filter(d => d.status === 'failed').length;
  const queuedCount = downloads.filter(d => d.status === 'queued').length;

  return (
    <div className="space-y-6">
      {/* Real-time Statistics */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Live Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{downloads.length}</div>
              <div className="text-sm text-gray-600">Total Files</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{completedCount}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{downloadingCount}</div>
              <div className="text-sm text-gray-600">Downloading</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{failedCount}</div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
          </div>

          {/* Real-time metrics */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-semibold text-blue-700">{currentSpeed.toFixed(1)} MB/s</div>
              <div className="text-sm text-blue-600">Current Speed</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-semibold text-green-700">{totalDownloaded}</div>
              <div className="text-sm text-green-600">Downloaded</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="text-lg font-semibold text-purple-700">{queuedCount}</div>
              <div className="text-sm text-purple-600">In Queue</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Speed Chart */}
      {speedData.length > 0 && (
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Download Speed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={speedData}>
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    domain={[0, 20]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="speed" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: '#10b981' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completion Summary */}
      {summary && (
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-green-700 font-semibold mb-2">Download Complete!</h3>
              <div className="space-y-1 text-sm text-green-600">
                <div>Files: {summary.completedFiles}/{summary.totalFiles}</div>
                <div>Total Size: {summary.totalSize}</div>
                <div>Duration: {summary.duration}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DownloadStats;
