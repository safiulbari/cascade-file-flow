
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Loader2, Pause, Play } from 'lucide-react';

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

  const isFormValid = url.trim() && folderName.trim();

  return (
    <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200 shadow-xl">
      <CardContent className="p-6">
        {/* Compact Form Layout */}
        <div className="space-y-4">
          {/* Main Inputs Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Server URL
              </label>
              <Input
                placeholder="https://files.example.com/folder/"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="border-blue-200 focus:border-blue-400 bg-white/80 backdrop-blur-sm"
                disabled={isDownloading}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Download Folder
              </label>
              <Input
                placeholder="My Downloads"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                className="border-blue-200 focus:border-blue-400 bg-white/80 backdrop-blur-sm"
                disabled={isDownloading}
              />
            </div>
          </div>

          {/* Options Row */}
          <div className="flex flex-wrap gap-6 p-4 bg-white/60 rounded-lg border border-blue-100">
            <div className="flex items-center space-x-3">
              <Switch
                checked={recursive}
                onCheckedChange={setRecursive}
                disabled={isDownloading}
                className="data-[state=checked]:bg-blue-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Recursive Download</span>
                <p className="text-xs text-gray-500">Include subdirectories</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Switch
                checked={createSubfolders}
                onCheckedChange={setCreateSubfolders}
                disabled={isDownloading || !recursive}
                className="data-[state=checked]:bg-green-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Create Subfolders</span>
                <p className="text-xs text-gray-500">Maintain directory structure</p>
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
                <Download className="mr-2 h-5 w-5" />
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
                    <Play className="mr-2 h-5 w-5" />
                    Resume Download
                  </Button>
                ) : (
                  <Button 
                    onClick={onPause}
                    variant="outline"
                    className="flex-1 border-orange-300 text-orange-700 hover:bg-orange-50 shadow-md transition-all duration-200"
                    size="lg"
                  >
                    <Pause className="mr-2 h-5 w-5" />
                    Pause Download
                  </Button>
                )}
                
                {/* Status Indicator */}
                <div className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg shadow-sm">
                  <Loader2 className="mr-3 h-5 w-5 animate-spin text-blue-600" />
                  <div className="text-right">
                    <div className="text-sm font-semibold text-blue-700">
                      {isPaused ? 'Download Paused' : 'Downloading...'}
                    </div>
                    <div className="text-xs text-blue-600">
                      {isPaused ? 'Click Resume to continue' : 'Processing files'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Help Text */}
          {!isDownloading && (
            <div className="text-center p-3 bg-blue-50/50 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-700">
                <span className="font-medium">💡 Tip:</span> Files will be saved to your Downloads folder → {folderName || 'Your Folder'}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DownloadForm;
