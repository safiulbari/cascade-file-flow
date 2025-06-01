
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Download, Clock, AlertTriangle, CheckCircle2, Share2, FolderOpen } from 'lucide-react';

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
  downloadSpeed?: string;
}

interface EnhancedDownloadStatsProps {
  downloads: DownloadStatus[];
  summary: DownloadSummary | null;
}

const EnhancedDownloadStats: React.FC<EnhancedDownloadStatsProps> = ({ downloads, summary }) => {
  const completedCount = downloads.filter(d => d.status === 'completed').length;
  const downloadingCount = downloads.filter(d => d.status === 'downloading').length;
  const failedCount = downloads.filter(d => d.status === 'failed').length;
  const queuedCount = downloads.filter(d => d.status === 'queued').length;

  const chartData = [
    { name: 'Completed', value: completedCount, color: '#10b981' },
    { name: 'Downloading', value: downloadingCount, color: '#3b82f6' },
    { name: 'Failed', value: failedCount, color: '#ef4444' },
    { name: 'Queued', value: queuedCount, color: '#f59e0b' },
  ];

  const successRate = downloads.length > 0 ? (completedCount / downloads.length) * 100 : 0;

  return (
    <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border-slate-700/50 shadow-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-green-500/20">
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
            <span>Live Analytics</span>
          </div>
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            Real-time
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl border border-blue-500/30">
            <div className="text-3xl font-bold text-blue-400">{downloads.length}</div>
            <div className="text-sm text-slate-300 flex items-center justify-center mt-1">
              <Download className="h-4 w-4 mr-1" />
              Total Files
            </div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl border border-green-500/30">
            <div className="text-3xl font-bold text-green-400">{completedCount}</div>
            <div className="text-sm text-slate-300 flex items-center justify-center mt-1">
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Completed
            </div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-xl border border-yellow-500/30">
            <div className="text-3xl font-bold text-yellow-400">{downloadingCount}</div>
            <div className="text-sm text-slate-300 flex items-center justify-center mt-1">
              <Clock className="h-4 w-4 mr-1" />
              Active
            </div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-xl border border-red-500/30">
            <div className="text-3xl font-bold text-red-400">{failedCount}</div>
            <div className="text-sm text-slate-300 flex items-center justify-center mt-1">
              <AlertTriangle className="h-4 w-4 mr-1" />
              Failed
            </div>
          </div>
        </div>

        {/* Success Rate */}
        {downloads.length > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-300">Success Rate</span>
              <span className="text-lg font-bold text-green-400">{Math.round(successRate)}%</span>
            </div>
            <Progress value={successRate} className="h-3 bg-slate-700" />
          </div>
        )}

        {/* Chart */}
        {downloads.length > 0 && (
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.filter(item => item.value > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Summary */}
        {summary && (
          <div className="p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-green-400 font-semibold flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Mission Accomplished! 🎉
              </h3>
              <Badge className="bg-green-500 text-white">
                Complete
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <div className="text-slate-300">Files: <span className="text-white font-semibold">{summary.completedFiles}/{summary.totalFiles}</span></div>
                <div className="text-slate-300">Size: <span className="text-blue-400 font-semibold">{summary.totalSize}</span></div>
              </div>
              <div className="space-y-1">
                <div className="text-slate-300">Duration: <span className="text-purple-400 font-semibold">{summary.duration}</span></div>
                {summary.downloadSpeed && (
                  <div className="text-slate-300">Speed: <span className="text-green-400 font-semibold">{summary.downloadSpeed}</span></div>
                )}
              </div>
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" className="flex-1 border-green-500/50 text-green-400 hover:bg-green-500/20">
                <FolderOpen className="h-4 w-4 mr-2" />
                Open Folder
              </Button>
              <Button variant="outline" size="sm" className="flex-1 border-blue-500/50 text-blue-400 hover:bg-blue-500/20">
                <Share2 className="h-4 w-4 mr-2" />
                Share Results
              </Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {downloads.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Analytics Dashboard</p>
            <p className="text-sm">Start a download to see real-time statistics and progress analytics.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedDownloadStats;
