
import React, { useState } from 'react';
import DownloadForm from '@/components/DownloadForm';
import DownloadProgress from '@/components/DownloadProgress';
import DownloadStats from '@/components/DownloadStats';
import { useDownload } from '@/hooks/useDownload';

const Index = () => {
  const [url, setUrl] = useState('');
  const [folderName, setFolderName] = useState('');
  const [recursive, setRecursive] = useState(true);
  
  const { isDownloading, downloads, summary, startDownload } = useDownload();

  const handleDownload = () => {
    startDownload(url, folderName, recursive);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">File Downloader</h1>
          <p className="text-gray-600">Download files from directory URLs with real-time progress tracking</p>
        </div>

        {/* Download Form */}
        <DownloadForm
          url={url}
          setUrl={setUrl}
          folderName={folderName}
          setFolderName={setFolderName}
          recursive={recursive}
          setRecursive={setRecursive}
          isDownloading={isDownloading}
          onDownload={handleDownload}
        />

        {/* Progress and Stats */}
        {downloads.length > 0 && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2">
              <DownloadProgress downloads={downloads} />
            </div>
            <div className="xl:col-span-1">
              <DownloadStats downloads={downloads} summary={summary} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
