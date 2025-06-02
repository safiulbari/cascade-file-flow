
import React, { useState } from 'react';
import DownloadForm from '@/components/DownloadForm';
import DownloadProgress from '@/components/DownloadProgress';
import DownloadStats from '@/components/DownloadStats';
import { useDownload } from '@/hooks/useDownload';

const Index = () => {
  const [url, setUrl] = useState('');
  const [folderName, setFolderName] = useState('');
  const [recursive, setRecursive] = useState(true);
  const [createSubfolders, setCreateSubfolders] = useState(false);
  
  const { isDownloading, downloads, summary, startDownload } = useDownload();

  const handleDownload = () => {
    startDownload(url, folderName, recursive, createSubfolders);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
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
