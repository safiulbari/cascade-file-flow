import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import io from 'socket.io-client';

interface DownloadStatus {
  id: string;
  filename: string;
  status: 'queued' | 'downloading' | 'completed' | 'failed' | 'paused';
  progress?: number;
  size?: string;
  error?: string;
  speed?: string;
  remainingTime?: string;
  startTime?: number;
}

interface DownloadSummary {
  totalFiles: number;
  completedFiles: number;
  failedFiles: number;
  totalSize: string;
  duration: string;
}

const STORAGE_KEY = 'download_manager_data';
const FORM_DATA_KEY = 'download_form_data';

export const useDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloads, setDownloads] = useState<DownloadStatus[]>([]);
  const [summary, setSummary] = useState<DownloadSummary | null>(null);
  const [socket, setSocket] = useState<any>(null);
  const { toast } = useToast();

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const { downloads: savedDownloads, summary: savedSummary, isDownloading: savedIsDownloading } = JSON.parse(savedData);
        setDownloads(savedDownloads || []);
        setSummary(savedSummary || null);
        setIsDownloading(savedIsDownloading || false);
      } catch (error) {
        console.error('Failed to load saved data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    const dataToSave = {
      downloads,
      summary,
      isDownloading,
      lastUpdated: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [downloads, summary, isDownloading]);

  // Clear all data function
  const clearAllData = useCallback(() => {
    setDownloads([]);
    setSummary(null);
    setIsDownloading(false);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(FORM_DATA_KEY);
    
    toast({
      title: "Data Cleared",
      description: "All download data has been cleared",
    });
  }, [toast]);

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
          ? { 
              ...item, 
              status: 'downloading', 
              progress: data.progress,
              startTime: item.startTime || Date.now()
            }
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

  const pauseDownload = useCallback((id: string) => {
    setDownloads(prev => prev.map(item => 
      item.id === id && item.status === 'downloading'
        ? { ...item, status: 'paused' }
        : item
    ));
    
    if (socket) {
      socket.emit('pauseDownload', { id });
    }
    
    toast({
      title: "Download Paused",
      description: "Download has been paused",
    });
  }, [socket, toast]);

  const resumeDownload = useCallback((id: string) => {
    setDownloads(prev => prev.map(item => 
      item.id === id && item.status === 'paused'
        ? { ...item, status: 'downloading' }
        : item
    ));
    
    if (socket) {
      socket.emit('resumeDownload', { id });
    }
    
    toast({
      title: "Download Resumed",
      description: "Download has been resumed",
    });
  }, [socket, toast]);

  // Real-time progress simulation for better UX
  useEffect(() => {
    if (!isDownloading) return;

    const interval = setInterval(() => {
      setDownloads(prev => prev.map(download => {
        if (download.status === 'downloading' && download.progress !== undefined && download.progress < 100) {
          const increment = Math.random() * 5 + 1;
          const newProgress = Math.min(download.progress + increment, 100);
          return { ...download, progress: newProgress };
        }
        return download;
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [isDownloading]);

  const startDownload = async (url: string, folderName: string, recursive: boolean, createSubfolders: boolean = false) => {
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
        body: JSON.stringify({ url, recursive, folderName, createSubfolders }),
      });

      if (!response.ok) {
        throw new Error('Failed to start download');
      }

      toast({
        title: "Download Started",
        description: `Starting download to "${folderName}" folder...`,
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
    startDownload,
    pauseDownload,
    resumeDownload,
    clearAllData
  };
};
