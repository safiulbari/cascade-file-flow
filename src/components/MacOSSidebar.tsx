import React from 'react';
import { Download, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { DownloadStatus, DownloadSummary } from '@/types/download';

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
        return <CheckCircle className="h-3 w-3 text-green-400" />;
      case 'downloading':
        return <Download className="h-3 w-3 text-blue-400" />;
      case 'paused':
        return <Clock className="h-3 w-3 text-orange-400" />;
      case 'failed':
        return <AlertCircle className="h-3 w-3 text-red-400" />;
      default:
        return <Clock className="h-3 w-3 text-gray-400" />;
    }
  };

  return (
    <div className="w-64 bg-black/30 backdrop-blur-xl border-r border-white/10 flex flex-col">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-white/10">
        <h2 className="text-lg font-semibold text-white/90">Downloads</h2>
      </div>

      {/* Statistics */}
      <div className="p-3 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white/5 rounded-lg p-2 border border-white/10">
            <div className="text-lg font-bold text-blue-400">{downloads.length}</div>
            <div className="text-xs text-white/60">Total</div>
          </div>
          <div className="bg-white/5 rounded-lg p-2 border border-white/10">
            <div className="text-lg font-bold text-green-400">{completedCount}</div>
            <div className="text-xs text-white/60">Done</div>
          </div>
          <div className="bg-white/5 rounded-lg p-2 border border-white/10">
            <div className="text-lg font-bold text-orange-400">{pausedCount}</div>
            <div className="text-xs text-white/60">Paused</div>
          </div>
          <div className="bg-white/5 rounded-lg p-2 border border-white/10">
            <div className="text-lg font-bold text-red-400">{failedCount}</div>
            <div className="text-xs text-white/60">Failed</div>
          </div>
        </div>
      </div>

      {/* Recent Downloads */}
      <div className="flex-1 p-3">
        <h3 className="text-sm font-medium text-white/70 mb-2">Recent</h3>
        <div className="space-y-1 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20">
          {downloads.slice(-8).reverse().map((download) => (
            <div key={download.id} className="bg-white/5 rounded-lg p-2 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="flex items-center space-x-2 mb-1">
                {getStatusIcon(download.status)}
                <span className="text-xs font-medium text-white/80 truncate flex-1">
                  {download.filename}
                </span>
              </div>
              {download.progress !== undefined && download.status !== 'completed' && (
                <div className="w-full bg-white/10 rounded-full h-1">
                  <div 
                    className="bg-blue-400 h-1 rounded-full transition-all duration-300" 
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
        <div className="p-3 border-t border-white/10 bg-green-500/20">
          <div className="text-sm font-medium text-green-300 mb-1">
            Complete!
          </div>
          <div className="text-xs text-green-200/80">
            {summary.completedFiles}/{summary.totalFiles} files • {summary.totalSize}
          </div>
        </div>
      )}
    </div>
  );
};

export default MacOSSidebar;
