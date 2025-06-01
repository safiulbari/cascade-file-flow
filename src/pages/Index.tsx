
import React, { useState, useRef } from 'react';
import HeroSection from '@/components/HeroSection';
import EnhancedDownloadForm from '@/components/EnhancedDownloadForm';
import EnhancedDownloadProgress from '@/components/EnhancedDownloadProgress';
import EnhancedDownloadStats from '@/components/EnhancedDownloadStats';
import Footer from '@/components/Footer';
import { useDownload } from '@/hooks/useDownload';

const Index = () => {
  const [url, setUrl] = useState('');
  const [folderName, setFolderName] = useState('');
  const [recursive, setRecursive] = useState(true);
  const [showDownloadSection, setShowDownloadSection] = useState(false);
  
  const downloadSectionRef = useRef<HTMLDivElement>(null);
  const { isDownloading, downloads, summary, startDownload } = useDownload();

  const handleGetStarted = () => {
    setShowDownloadSection(true);
    setTimeout(() => {
      downloadSectionRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  const handleDownload = () => {
    startDownload(url, folderName, recursive);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section */}
      <HeroSection onGetStarted={handleGetStarted} />

      {/* Download Section */}
      {showDownloadSection && (
        <div ref={downloadSectionRef} className="max-w-7xl mx-auto px-6 py-12 space-y-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Let's Get Downloading! 🚀
            </h2>
            <p className="text-xl text-slate-300">
              Configure your download preferences and watch the magic happen
            </p>
          </div>

          <EnhancedDownloadForm
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
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <EnhancedDownloadProgress downloads={downloads} />
              <EnhancedDownloadStats downloads={downloads} summary={summary} />
            </div>
          )}
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Index;
