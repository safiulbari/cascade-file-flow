
import React, { useState, useEffect } from 'react';
import DownloadForm from '@/components/DownloadForm';
import DownloadProgress from '@/components/DownloadProgress';
import MacOSSidebar from '@/components/MacOSSidebar';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useDownload } from '@/hooks/useDownload';

const FORM_DATA_KEY = 'download_form_data';

const Index = () => {
  const [url, setUrl] = useState('');
  const [folderName, setFolderName] = useState('');
  const [recursive, setRecursive] = useState(true);
  const [createSubfolders, setCreateSubfolders] = useState(false);
  
  const { isDownloading, downloads, summary, startDownload, pauseDownload, resumeDownload, clearAllData } = useDownload();

  // Load form data from localStorage on mount
  useEffect(() => {
    const savedFormData = localStorage.getItem(FORM_DATA_KEY);
    if (savedFormData) {
      try {
        const { url: savedUrl, folderName: savedFolderName, recursive: savedRecursive, createSubfolders: savedCreateSubfolders } = JSON.parse(savedFormData);
        setUrl(savedUrl || '');
        setFolderName(savedFolderName || '');
        setRecursive(savedRecursive !== undefined ? savedRecursive : true);
        setCreateSubfolders(savedCreateSubfolders || false);
      } catch (error) {
        console.error('Failed to load saved form data:', error);
      }
    }
  }, []);

  // Save form data to localStorage whenever form state changes
  useEffect(() => {
    const formData = {
      url,
      folderName,
      recursive,
      createSubfolders,
      lastUpdated: Date.now()
    };
    localStorage.setItem(FORM_DATA_KEY, JSON.stringify(formData));
  }, [url, folderName, recursive, createSubfolders]);

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
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllData}
              className="h-7 bg-red-500/20 border-red-400/30 hover:bg-red-500/30 text-red-300 text-xs"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Clear All
            </Button>
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
