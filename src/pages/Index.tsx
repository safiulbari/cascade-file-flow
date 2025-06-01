
import React, { useState } from 'react';
import AppHeader from '@/components/AppHeader';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <AppHeader />

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

        {downloads.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DownloadProgress downloads={downloads} />
            <DownloadStats downloads={downloads} summary={summary} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
