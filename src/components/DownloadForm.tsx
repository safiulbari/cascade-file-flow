
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
    <Card className="bg-white border border-gray-200 shadow-lg">
      <CardContent className="p-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-800">URL</label>
            <Input
              placeholder="http://example.com/folder/"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="bg-white border-gray-300 text-gray-900 placeholder-gray-400"
              disabled={isDownloading}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-800">Folder Name</label>
            <Input
              placeholder="My Downloads"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="bg-white border-gray-300 text-gray-900 placeholder-gray-400"
              disabled={isDownloading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-800">Recursive</label>
            <div className="flex items-center space-x-2 h-10">
              <Switch
                checked={recursive}
                onCheckedChange={setRecursive}
                disabled={isDownloading}
              />
              <span className="text-sm text-gray-600">Include subdirectories</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-800">Create Subfolders</label>
            <div className="flex items-center space-x-2 h-10">
              <Switch
                checked={createSubfolders}
                onCheckedChange={setCreateSubfolders}
                disabled={isDownloading || !recursive}
              />
              <span className="text-sm text-gray-600">Create subdirectory folders</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          {!isDownloading ? (
            <Button 
              onClick={onDownload}
              disabled={!isFormValid}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all hover:shadow-lg"
              size="lg"
            >
              <Download className="mr-2 h-4 w-4" />
              Start Download
            </Button>
          ) : (
            <>
              {isPaused ? (
                <Button 
                  onClick={onResume}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-md transition-all hover:shadow-lg"
                  size="lg"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Resume Download
                </Button>
              ) : (
                <Button 
                  onClick={onPause}
                  variant="outline"
                  className="flex-1 border-orange-300 text-orange-700 hover:bg-orange-50 shadow-md transition-all hover:shadow-lg"
                  size="lg"
                >
                  <Pause className="mr-2 h-4 w-4" />
                  Pause Download
                </Button>
              )}
              <div className="flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-blue-600" />
                <span className="text-sm font-medium text-blue-700">
                  {isPaused ? 'Paused' : 'Downloading...'}
                </span>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DownloadForm;
