
import React, { useState } from 'react';
import DownloadForm from '@/components/DownloadForm';
import DownloadProgress from '@/components/DownloadProgress';
import DownloadStats from '@/components/DownloadStats';
import MacOSSidebar from '@/components/MacOSSidebar';
import { useDownload } from '@/hooks/useDownload';

const Index = () => {
  const [url, setUrl] = useState('');
  const [folderName, setFolderName] = useState('');
  const [recursive, setRecursive] = useState(true);
  const [createSubfolders, setCreateSubfolders] = useState(false);
  
  const { isDownloading, downloads, summary, startDownload, pauseDownload, resumeDownload } = useDownload();

  const handleDownload = () => {
    startDownload(url, folderName, recursive, createSubfolders);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl flex">
      {/* macOS Style Sidebar */}
      <MacOSSidebar downloads={downloads} summary={summary} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* macOS Style Title Bar */}
        <div className="h-10 bg-black/20 backdrop-blur-xl border-b border-white/10 flex items-center px-4">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors cursor-pointer"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors cursor-pointer"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors cursor-pointer"></div>
          </div>
          <div className="flex-1 text-center text-sm font-medium text-white/90">
            Download Manager
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 space-y-4 overflow-auto">
          {/* Download Form */}
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
            onDownload={handleDownload}
          />

          {/* Progress */}
          {downloads.length > 0 && (
            <DownloadProgress 
              downloads={downloads} 
              onPause={pauseDownload}
              onResume={resumeDownload}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
