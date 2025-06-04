
import React, { useState } from 'react';
import DownloadForm from '@/components/DownloadForm';
import DownloadProgress from '@/components/DownloadProgress';
import DownloadStats from '@/components/DownloadStats';
import DownloadQueue from '@/components/DownloadQueue';
import SpeedChart from '@/components/SpeedChart';
import ThemeToggle from '@/components/ThemeToggle';
import { useDownload } from '@/hooks/useDownload';
import { Badge } from '@/components/ui/badge';
import { Zap, Activity } from 'lucide-react';

const Index = () => {
  const [url, setUrl] = useState('');
  const [folderName, setFolderName] = useState('');
  const [recursive, setRecursive] = useState(true);
  const [createSubfolders, setCreateSubfolders] = useState(false);
  
  const { isDownloading, isPaused, downloads, summary, startDownload, pauseDownload, resumeDownload } = useDownload();

  const handleDownload = () => {
    startDownload(url, folderName, recursive, createSubfolders);
  };

  const currentSpeed = downloads.find(d => d.status === 'downloading')?.speed 
    ? parseFloat(downloads.find(d => d.status === 'downloading')?.speed?.replace(' MB/s', '') || '0')
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <ThemeToggle />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 dark:from-gray-800 dark:via-gray-900 dark:to-black">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white">
                ProDownloader
                <Badge className="ml-3 bg-yellow-500 text-yellow-900 text-xs">PRO</Badge>
              </h1>
            </div>
            <p className="text-xl text-blue-100 dark:text-gray-300 max-w-2xl mx-auto">
              High-performance directory downloader with real-time monitoring, advanced features, and enterprise-grade reliability
            </p>
            
            {isDownloading && (
              <div className="mt-4 inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Activity className="h-4 w-4 text-green-400 animate-pulse" />
                <span className="text-white text-sm font-medium">
                  {isPaused ? 'Download Paused' : 'Download Active'}
                </span>
              </div>
            )}
          </div>

          <DownloadForm
            url={url}
            setUrl={setUrl}
            folderName={folderName}
            setFolderName={setFolderName}
            recursive={recursive}
            setRecursive={setRecursive}
            createSubfolders={createSubfolders}
            setCreateSubfolders={setCreateSubfolders}
            isDownloading={isDownloading}
            isPaused={isPaused}
            onDownload={handleDownload}
            onPause={pauseDownload}
            onResume={resumeDownload}
          />
        </div>
      </div>

      {/* Main Content */}
      {downloads.length > 0 && (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Progress and Stats Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              <DownloadProgress downloads={downloads} />
              <DownloadQueue downloads={downloads} />
            </div>
            <div className="xl:col-span-1 space-y-6">
              <DownloadStats downloads={downloads} summary={summary} />
              <SpeedChart currentSpeed={currentSpeed} isDownloading={isDownloading && !isPaused} />
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-16 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="font-bold text-gray-900 dark:text-white">ProDownloader</span>
              <Badge variant="outline" className="text-xs">Enterprise Edition</Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Professional-grade downloading solution with advanced monitoring
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
