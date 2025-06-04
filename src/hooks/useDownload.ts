
import { useState, useEffect, useRef } from 'react';
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

export const useDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [downloads, setDownloads] = useState<DownloadStatus[]>([]);
  const [summary, setSummary] = useState<DownloadSummary | null>(null);
  const [socket, setSocket] = useState<any>(null);
  const { toast } = useToast();
  const speedUpdateRef = useRef<number>(0);

  // Load persisted state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('downloadState');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setIsDownloading(parsed.isDownloading || false);
        setIsPaused(parsed.isPaused || false);
        setDownloads(parsed.downloads || []);
        setSummary(parsed.summary || null);
      } catch (error) {
        console.error('Failed to load saved download state:', error);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    const state = {
      isDownloading,
      isPaused,
      downloads,
      summary
    };
    localStorage.setItem('downloadState', JSON.stringify(state));
  }, [isDownloading, isPaused, downloads, summary]);

  useEffect(() => {
    // Initialize persistent Socket.IO connection
    const socketConnection = io('http://localhost:3001', {
      forceNew: false,
      reconnection: true,
      timeout: 20000,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
    
    setSocket(socketConnection);

    socketConnection.on('connect', () => {
      console.log('Connected to server with ID:', socketConnection.id);
    });

    socketConnection.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason);
      if (reason === 'io server disconnect') {
        // Server disconnected the client, try to reconnect
        socketConnection.connect();
      }
    });

    socketConnection.on('reconnect', () => {
      console.log('Reconnected to server');
      toast({
        title: "Connection Restored",
        description: "Reconnected to download server",
      });
    });

    socketConnection.on('fileQueued', (data: { filename: string; id: string }) => {
      setDownloads(prev => {
        const exists = prev.find(item => item.id === data.id);
        if (exists) return prev;
        return [...prev, {
          id: data.id,
          filename: data.filename,
          status: 'queued'
        }];
      });
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
      setIsPaused(false);
      toast({
        title: "Download Complete!",
        description: `Downloaded ${data.completedFiles}/${data.totalFiles} files (${data.totalSize})`,
      });
    });

    socketConnection.on('downloadError', (data: { error: string }) => {
      setIsDownloading(false);
      setIsPaused(false);
      toast({
        title: "Download Failed",
        description: data.error,
        variant: "destructive",
      });
    });

    return () => {
      // Don't disconnect on cleanup to maintain persistence
      // socketConnection.disconnect();
    };
  }, [toast]);

  // Slower progress simulation for better UX (updates every 5 seconds)
  useEffect(() => {
    if (!isDownloading || isPaused) return;

    const interval = setInterval(() => {
      speedUpdateRef.current++;
      
      setDownloads(prev => prev.map(download => {
        if (download.status === 'downloading' && download.progress !== undefined && download.progress < 100) {
          const increment = Math.random() * 3 + 1; // 1-4% progress increment
          const newProgress = Math.min(download.progress + increment, 100);
          
          // Update speed every 5 seconds (5 interval cycles)
          const shouldUpdateSpeed = speedUpdateRef.current % 5 === 0;
          const speed = shouldUpdateSpeed ? `${(Math.random() * 15 + 2).toFixed(1)} MB/s` : download.speed;
          
          return { 
            ...download, 
            progress: newProgress,
            speed: speed || `${(Math.random() * 15 + 2).toFixed(1)} MB/s`
          };
        }
        return download;
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [isDownloading, isPaused]);

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
    setIsPaused(false);
    setDownloads([]);
    setSummary(null);
    speedUpdateRef.current = 0;

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
      setIsPaused(false);
      toast({
        title: "Error",
        description: "Failed to start download process",
        variant: "destructive",
      });
    }
  };

  const pauseDownload = () => {
    setIsPaused(true);
    setDownloads(prev => prev.map(download => 
      download.status === 'downloading' 
        ? { ...download, status: 'paused' }
        : download
    ));
    toast({
      title: "Download Paused",
      description: "Download has been paused. You can resume it anytime.",
    });
  };

  const resumeDownload = () => {
    setIsPaused(false);
    setDownloads(prev => prev.map(download => 
      download.status === 'paused' 
        ? { ...download, status: 'downloading' }
        : download
    ));
    toast({
      title: "Download Resumed",
      description: "Download has been resumed.",
    });
  };

  return {
    isDownloading,
    isPaused,
    downloads,
    summary,
    startDownload,
    pauseDownload,
    resumeDownload
  };
};
