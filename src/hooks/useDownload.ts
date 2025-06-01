
import { useState, useEffect } from 'react';
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

export const useDownload = () => {
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

  const startDownload = async (url: string, folderName: string, recursive: boolean) => {
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

  return {
    isDownloading,
    downloads,
    summary,
    startDownload
  };
};
