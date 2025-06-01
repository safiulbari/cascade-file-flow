
import React from 'react';
import { Download } from 'lucide-react';

const AppHeader: React.FC = () => {
  return (
    <div className="text-center space-y-4">
      <div className="flex items-center justify-center space-x-3">
        <Download className="h-8 w-8 text-blue-400" />
        <h1 className="text-4xl font-bold text-white">File Downloader & Crawler</h1>
      </div>
      <p className="text-lg text-slate-300 max-w-2xl mx-auto">
        Paste an HTTP directory URL to crawl and download all video files and images while preserving folder structure
      </p>
    </div>
  );
};

export default AppHeader;
