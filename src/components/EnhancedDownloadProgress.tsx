
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Clock, Loader2, FileText, Pause, Play, X, Download } from 'lucide-react';

interface DownloadStatus {
  id: string;
  filename: string;
  status: 'queued' | 'downloading' | 'completed' | 'failed' | 'paused';
  progress?: number;
  size?: string;
  error?: string;
  speed?: string;
  timeRemaining?: string;
}

interface EnhancedDownloadProgressProps {
  downloads: DownloadStatus[];
}

const EnhancedDownloadProgress: React.FC<EnhancedDownloadProgressProps> = ({ downloads }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'queued':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'downloading':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'paused':
        return <Pause className="h-4 w-4 text-orange-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      queued: { variant: 'secondary' as const, color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
      downloading: { variant: 'default' as const, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
      completed: { variant: 'default' as const, color: 'bg-green-500/20 text-green-400 border-green-500/30' },
      failed: { variant: 'destructive' as const, color: 'bg-red-500/20 text-red-400 border-red-500/30' },
      paused: { variant: 'secondary' as const, color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' }
    };

    const config = variants[status as keyof typeof variants] || variants.queued;

    return (
      <Badge variant={config.variant} className={config.color}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const overallProgress = downloads.length > 0 
    ? (downloads.filter(d => d.status === 'completed').length / downloads.length) * 100 
    : 0;

  return (
    <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border-slate-700/50 shadow-2xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Download className="h-5 w-5 text-blue-400" />
            </div>
            <span>Download Progress</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <Play className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <Pause className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {downloads.length > 0 && (
          <div className="space-y-2 mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">Overall Progress</span>
              <span className="text-blue-400 font-semibold">{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-2 bg-slate-700" />
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-3">
            {downloads.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Download className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Ready for Action!</p>
                <p className="text-sm">Your downloads will appear here once you start the process.</p>
              </div>
            ) : (
              downloads.map((download) => (
                <div key={download.id} className="p-4 bg-slate-700/30 rounded-xl border border-slate-600/50 space-y-3 hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      {getStatusIcon(download.status)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate font-medium" title={download.filename}>
                          {download.filename}
                        </p>
                        {download.speed && download.timeRemaining && (
                          <p className="text-xs text-slate-400">
                            {download.speed} • {download.timeRemaining} remaining
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(download.status)}
                      {download.status === 'downloading' && (
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {download.status === 'downloading' && download.progress !== undefined && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Progress</span>
                        <span className="text-blue-400 font-semibold">{download.progress}%</span>
                      </div>
                      <Progress value={download.progress} className="h-1.5 bg-slate-600" />
                    </div>
                  )}
                  
                  {download.size && (
                    <div className="text-xs text-slate-400 flex items-center justify-between">
                      <span>Size: {download.size}</span>
                      {download.status === 'completed' && (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      )}
                    </div>
                  )}
                  
                  {download.error && (
                    <div className="text-xs text-red-400 bg-red-500/10 p-2 rounded border border-red-500/30">
                      ⚠️ {download.error}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default EnhancedDownloadProgress;
