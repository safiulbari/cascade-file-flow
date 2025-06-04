
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Loader2, Pause, Play, Sparkles } from 'lucide-react';

interface DownloadFormProps {
  url: string;
  setUrl: (url: string) => void;
  folderName: string;
  setFolderName: (name: string) => void;
  recursive: boolean;
  setRecursive: (recursive: boolean) => void;
  createSubfolders: boolean;
  setCreateSubfolders: (createSubfolders: boolean) => void;
  isDownloading: boolean;
  isPaused?: boolean;
  onDownload: () => void;
  onPause?: () => void;
  onResume?: () => void;
}

const DownloadForm: React.FC<DownloadFormProps> = ({
  url,
  setUrl,
  folderName,
  setFolderName,
  recursive,
  setRecursive,
  createSubfolders,
  setCreateSubfolders,
  isDownloading,
  isPaused = false,
  onDownload,
  onPause,
  onResume
}) => {
  // Function to extract and suggest folder name from URL
  const suggestFolderName = (inputUrl: string) => {
    if (!inputUrl) return '';
    
    try {
      // Extract the last meaningful part of the URL path
      const url = new URL(inputUrl);
      const pathParts = url.pathname.split('/').filter(part => part.length > 0);
      const lastPart = pathParts[pathParts.length - 1];
      
      if (!lastPart) return '';
      
      // Decode URL encoding
      let decoded = decodeURIComponent(lastPart);
      
      // Remove common patterns and clean up
      decoded = decoded
        .replace(/\([^)]*\)/g, '') // Remove parentheses and content
        .replace(/\[[^\]]*\]/g, '') // Remove brackets and content
        .replace(/%20/g, ' ') // Replace %20 with spaces
        .replace(/[-_]+/g, ' ') // Replace dashes and underscores with spaces
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .trim();
      
      // Capitalize first letter of each word
      decoded = decoded.replace(/\b\w/g, l => l.toUpperCase());
      
      // Remove common suffixes
      decoded = decoded
        .replace(/\s*(TV\s*Series|Web\s*Series|Season\s*\d+|S\d+|1080p|720p|480p|HDTV|WEB-DL|BluRay|x264|x265|HEVC).*$/i, '')
        .trim();
      
      return decoded;
    } catch (error) {
      return '';
    }
  };

  // Auto-suggest folder name when URL changes
  useEffect(() => {
    if (url && !folderName) {
      const suggested = suggestFolderName(url);
      if (suggested) {
        setFolderName(suggested);
      }
    }
  }, [url, folderName, setFolderName]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('downloadFormData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setUrl(parsed.url || '');
      setFolderName(parsed.folderName || '');
      setRecursive(parsed.recursive !== undefined ? parsed.recursive : true);
      setCreateSubfolders(parsed.createSubfolders !== undefined ? parsed.createSubfolders : false);
    }
  }, [setUrl, setFolderName, setRecursive, setCreateSubfolders]);

  // Save data to localStorage whenever form data changes
  useEffect(() => {
    const formData = {
      url,
      folderName,
      recursive,
      createSubfolders
    };
    localStorage.setItem('downloadFormData', JSON.stringify(formData));
  }, [url, folderName, recursive, createSubfolders]);

  const handleUrlChange = (value: string) => {
    setUrl(value);
    if (value && !folderName) {
      const suggested = suggestFolderName(value);
      if (suggested) {
        setFolderName(suggested);
      }
    }
  };

  const isFormValid = url.trim() && folderName.trim();

  return (
    <Card className="bg-gradient-to-br from-white via-blue-50 to-indigo-50 border-blue-200 shadow-xl">
      <CardContent className="p-5">
        <div className="space-y-4">
          {/* Compact Input Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Directory URL
              </label>
              <Input
                placeholder="http://example.com/files/folder/"
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                className="border-blue-200 focus:border-blue-400 bg-white/90 backdrop-blur-sm transition-all duration-200"
                disabled={isDownloading}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Download Folder
                {folderName && suggestFolderName(url) && (
                  <Sparkles className="h-3 w-3 text-amber-500 ml-1" />
                )}
              </label>
              <Input
                placeholder="My Downloads"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                className="border-blue-200 focus:border-blue-400 bg-white/90 backdrop-blur-sm transition-all duration-200"
                disabled={isDownloading}
              />
            </div>
          </div>

          {/* Compact Options */}
          <div className="flex flex-wrap gap-4 p-3 bg-white/70 rounded-lg border border-blue-100 backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <Switch
                checked={recursive}
                onCheckedChange={setRecursive}
                disabled={isDownloading}
                className="data-[state=checked]:bg-blue-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Recursive</span>
                <p className="text-xs text-gray-500">Include subdirectories</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={createSubfolders}
                onCheckedChange={setCreateSubfolders}
                disabled={isDownloading || !recursive}
                className="data-[state=checked]:bg-green-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Keep Structure</span>
                <p className="text-xs text-gray-500">Maintain folder hierarchy</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {!isDownloading ? (
              <Button 
                onClick={onDownload}
                disabled={!isFormValid}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg transition-all duration-200 hover:shadow-xl transform hover:-translate-y-0.5"
                size="lg"
              >
                <Download className="mr-2 h-4 w-4" />
                Start Download
              </Button>
            ) : (
              <div className="flex gap-3 w-full">
                {isPaused ? (
                  <Button 
                    onClick={onResume}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg transition-all duration-200"
                    size="lg"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Resume Download
                  </Button>
                ) : (
                  <Button 
                    onClick={onPause}
                    variant="outline"
                    className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-50 shadow-md transition-all duration-200"
                    size="lg"
                  >
                    <Pause className="mr-2 h-4 w-4" />
                    Pause Download
                  </Button>
                )}
                
                {/* Compact Status */}
                <div className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg shadow-sm">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin text-blue-600" />
                  <div className="text-sm">
                    <div className="font-semibold text-blue-700">
                      {isPaused ? 'Paused' : 'Active'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Smart Tip */}
          {!isDownloading && (
            <div className="text-center p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
              <p className="text-xs text-blue-700">
                <span className="font-medium">💡 Smart Tip:</span> 
                {folderName ? ` Files → Downloads/${folderName}` : ' Paste URL for auto folder naming'}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DownloadForm;
