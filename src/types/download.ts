
export interface DownloadStatus {
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

export interface DownloadSummary {
  totalFiles: number;
  completedFiles: number;
  failedFiles: number;
  totalSize: string;
  duration: string;
}

export interface DownloadSession {
  id: string;
  name: string;
  url: string;
  recursive: boolean;
  createSubfolders: boolean;
  downloads: DownloadStatus[];
  summary: DownloadSummary | null;
  isDownloading: boolean;
  createdAt: number;
}
