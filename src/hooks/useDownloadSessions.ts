
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { DownloadSession, DownloadStatus, DownloadSummary } from '@/types/download';
import io from 'socket.io-client';

const SESSIONS_STORAGE_KEY = 'download_sessions';

export const useDownloadSessions = () => {
  const [sessions, setSessions] = useState<DownloadSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [socket, setSocket] = useState<any>(null);
  const { toast } = useToast();

  // Load sessions from localStorage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (savedSessions) {
      try {
        const parsedSessions: DownloadSession[] = JSON.parse(savedSessions);
        setSessions(parsedSessions);
        if (parsedSessions.length > 0 && !activeSessionId) {
          setActiveSessionId(parsedSessions[0].id);
        }
      } catch (error) {
        console.error('Failed to load sessions:', error);
      }
    }
  }, []);

  // Save sessions to localStorage whenever sessions change
  useEffect(() => {
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  // Initialize socket connection
  useEffect(() => {
    const socketConnection = io('http://localhost:3001');
    setSocket(socketConnection);

    socketConnection.on('connect', () => {
      console.log('Connected to server');
    });

    socketConnection.on('fileQueued', (data: { filename: string; id: string }) => {
      if (activeSessionId) {
        updateSessionDownload(activeSessionId, data.id, {
          id: data.id,
          filename: data.filename,
          status: 'queued'
        });
      }
    });

    socketConnection.on('fileDownloading', (data: { id: string; progress?: number }) => {
      if (activeSessionId) {
        updateSessionDownload(activeSessionId, data.id, {
          status: 'downloading',
          progress: data.progress,
          startTime: Date.now()
        });
      }
    });

    socketConnection.on('fileCompleted', (data: { id: string; size: string }) => {
      if (activeSessionId) {
        updateSessionDownload(activeSessionId, data.id, {
          status: 'completed',
          size: data.size,
          progress: 100
        });
      }
    });

    socketConnection.on('fileFailed', (data: { id: string; error: string }) => {
      if (activeSessionId) {
        updateSessionDownload(activeSessionId, data.id, {
          status: 'failed',
          error: data.error
        });
      }
    });

    socketConnection.on('downloadComplete', (data: DownloadSummary) => {
      if (activeSessionId) {
        updateSessionSummary(activeSessionId, data);
        updateSessionStatus(activeSessionId, false);
        toast({
          title: "Download Complete!",
          description: `Downloaded ${data.completedFiles}/${data.totalFiles} files (${data.totalSize})`,
        });
      }
    });

    socketConnection.on('downloadError', (data: { error: string }) => {
      if (activeSessionId) {
        updateSessionStatus(activeSessionId, false);
        toast({
          title: "Download Failed",
          description: data.error,
          variant: "destructive",
        });
      }
    });

    return () => {
      socketConnection.disconnect();
    };
  }, [activeSessionId, toast]);

  const createSession = useCallback((name: string, url: string, recursive: boolean, createSubfolders: boolean) => {
    const newSession: DownloadSession = {
      id: Date.now().toString(),
      name,
      url,
      recursive,
      createSubfolders,
      downloads: [],
      summary: null,
      isDownloading: false,
      createdAt: Date.now()
    };

    setSessions(prev => [...prev, newSession]);
    setActiveSessionId(newSession.id);
    return newSession.id;
  }, []);

  const deleteSession = useCallback((sessionId: string) => {
    setSessions(prev => {
      const filtered = prev.filter(s => s.id !== sessionId);
      if (activeSessionId === sessionId && filtered.length > 0) {
        setActiveSessionId(filtered[0].id);
      } else if (filtered.length === 0) {
        setActiveSessionId(null);
      }
      return filtered;
    });
  }, [activeSessionId]);

  const renameSession = useCallback((sessionId: string, newName: string) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId ? { ...session, name: newName } : session
    ));
  }, []);

  const updateSessionDownload = useCallback((sessionId: string, downloadId: string, updates: Partial<DownloadStatus>) => {
    setSessions(prev => prev.map(session => {
      if (session.id !== sessionId) return session;
      
      const existingDownload = session.downloads.find(d => d.id === downloadId);
      if (existingDownload) {
        return {
          ...session,
          downloads: session.downloads.map(d => 
            d.id === downloadId ? { ...d, ...updates } : d
          )
        };
      } else {
        return {
          ...session,
          downloads: [...session.downloads, { ...updates } as DownloadStatus]
        };
      }
    }));
  }, []);

  const updateSessionSummary = useCallback((sessionId: string, summary: DownloadSummary) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId ? { ...session, summary } : session
    ));
  }, []);

  const updateSessionStatus = useCallback((sessionId: string, isDownloading: boolean) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId ? { ...session, isDownloading } : session
    ));
  }, []);

  const startDownload = useCallback(async (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    updateSessionStatus(sessionId, true);
    setSessions(prev => prev.map(s => 
      s.id === sessionId ? { ...s, downloads: [], summary: null } : s
    ));

    try {
      const response = await fetch('http://localhost:3001/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: session.url,
          recursive: session.recursive,
          folderName: session.name,
          createSubfolders: session.createSubfolders
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start download');
      }

      toast({
        title: "Download Started",
        description: `Starting download for "${session.name}"...`,
      });
    } catch (error) {
      updateSessionStatus(sessionId, false);
      toast({
        title: "Error",
        description: "Failed to start download process",
        variant: "destructive",
      });
    }
  }, [sessions, toast]);

  const clearAllSessions = useCallback(() => {
    setSessions([]);
    setActiveSessionId(null);
    localStorage.removeItem(SESSIONS_STORAGE_KEY);
    toast({
      title: "All Data Cleared",
      description: "All download sessions have been cleared",
    });
  }, [toast]);

  const activeSession = sessions.find(s => s.id === activeSessionId) || null;

  return {
    sessions,
    activeSession,
    activeSessionId,
    setActiveSessionId,
    createSession,
    deleteSession,
    renameSession,
    startDownload,
    clearAllSessions,
    socket
  };
};
