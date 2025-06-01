
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download, FileText, CheckCircle, AlertCircle, Clock, Loader2, Folder } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import io from 'socket.io-client';

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

const Index = () => {
  const [url, setUrl] = useState('');
  const [folderName, setFolderName] = useState('');
  const [recursive, setRecursive] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloads, setDownloads] = useState<DownloadStatus[]>([]);
  const [summary, setSummary] = useState<DownloadSummary | null>(null);
  const [socket, setSocket] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize Socket.IO connection
    const socketConnection = io('http://localhost:3001');
    setSocket(socketConnection);

    socketConnection.on('connect', () => {
      console.log('Connected to server');
    });

    socketConnection.on('fileQueued', (data: { filename: string; id: string }) => {
      setDownloads(prev => [...prev, {
        id: data.id,
        filename: data.filename,
        status: 'queued'
      }]);
    });

    socketConnection.on('fileDownloading', (data: { id: string; progress?: number }) => {
      setDownloads(prev => prev.map(item => 
        item.id === data.id 
          ? { ...item, status: 'downloading', progress: data.progress }
          : item
      ));
    });

    socketConnection.on('fileCompleted', (data: { id: string; size: string }) => {
      setDownloads(prev => prev.map(item => 
        item.id === data.id 
          ? { ...item, status: 'completed', size: data.size, progress: 100 }
          : item
      ));
    });

    socketConnection.on('fileFailed', (data: { id: string; error: string }) => {
      setDownloads(prev => prev.map(item => 
        item.id === data.id 
          ? { ...item, status: 'failed', error: data.error }
          : item
      ));
    });

    socketConnection.on('downloadComplete', (data: DownloadSummary) => {
      setSummary(data);
      setIsDownloading(false);
      toast({
        title: "Download Complete!",
        description: `Downloaded ${data.completedFiles}/${data.totalFiles} files (${data.totalSize})`,
      });
    });

    socketConnection.on('downloadError', (data: { error: string }) => {
      setIsDownloading(false);
      toast({
        title: "Download Failed",
        description: data.error,
        variant: "destructive",
      });
    });

    return () => {
      socketConnection.disconnect();
    };
  }, [toast]);

  const handleDownload = async () => {
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
      return;
    }

    if (!folderName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a folder name",
        variant: "destructive",
      });
      return;
    }

    setIsDownloading(true);
    setDownloads([]);
    setSummary(null);

    try {
      const response = await fetch('http://localhost:3001/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, recursive, folderName }),
      });

      if (!response.ok) {
        throw new Error('Failed to start download');
      }

      toast({
        title: "Download Started",
        description: `Crawling directory and starting downloads to "${folderName}" folder...`,
      });
    } catch (error) {
      setIsDownloading(false);
      toast({
        title: "Error",
        description: "Failed to start download process",
        variant: "destructive",
      });
    }
  };

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
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      queued: 'secondary',
      downloading: 'default',
      completed: 'default', // Changed from 'success' to 'default'
      failed: 'destructive'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Download className="h-8 w-8 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">File Downloader & Crawler</h1>
          </div>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Paste an HTTP directory URL to crawl and download all video files and images while preserving folder structure
          </p>
        </div>

        {/* Download Form */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Download Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Directory URL</label>
              <Input
                placeholder="http://example.com/folder/"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                disabled={isDownloading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Folder Name</label>
              <div className="flex items-center space-x-2">
                <Folder className="h-4 w-4 text-slate-400" />
                <Input
                  placeholder="My Downloads"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  disabled={isDownloading}
                />
              </div>
              <p className="text-xs text-slate-400">Files will be saved to: downloads/{folderName}</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Switch
                checked={recursive}
                onCheckedChange={setRecursive}
                disabled={isDownloading}
              />
              <label className="text-sm text-slate-300">Recursive download (include subdirectories)</label>
            </div>

            <Button 
              onClick={handleDownload}
              disabled={isDownloading || !url.trim() || !folderName.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Start Download
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Download Progress */}
        {downloads.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* File List */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Download Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {downloads.map((download) => (
                      <div key={download.id} className="p-3 bg-slate-700 rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 flex-1 min-w-0">
                            {getStatusIcon(download.status)}
                            <span className="text-sm text-white truncate" title={download.filename}>
                              {download.filename}
                            </span>
                          </div>
                          {getStatusBadge(download.status)}
                        </div>
                        
                        {download.status === 'downloading' && download.progress !== undefined && (
                          <Progress value={download.progress} className="h-2" />
                        )}
                        
                        {download.size && (
                          <div className="text-xs text-slate-400">Size: {download.size}</div>
                        )}
                        
                        {download.error && (
                          <div className="text-xs text-red-400">Error: {download.error}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Summary Stats */}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
