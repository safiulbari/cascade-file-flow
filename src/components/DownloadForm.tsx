
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Loader2 } from 'lucide-react';

interface DownloadFormProps {
  url: string;
  setUrl: (url: string) => void;
  folderName: string;
  setFolderName: (name: string) => void;
  recursive: boolean;
  setRecursive: (recursive: boolean) => void;
  isDownloading: boolean;
  onDownload: () => void;
}

const DownloadForm: React.FC<DownloadFormProps> = ({
  url,
  setUrl,
  folderName,
  setFolderName,
  recursive,
  setRecursive,
  isDownloading,
  onDownload
}) => {
  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Directory URL</label>
          <Input
            placeholder="http://example.com/folder/"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="bg-white border-gray-300 text-gray-900 placeholder-gray-400"
            disabled={isDownloading}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Directory</label>
            <Input
              placeholder="Directory path"
              value={url.split('/').slice(-2, -1)[0] || ''}
              className="bg-gray-50 border-gray-300 text-gray-500"
              disabled
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Folder Name</label>
            <Input
              placeholder="My Downloads"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="bg-white border-gray-300 text-gray-900 placeholder-gray-400"
              disabled={isDownloading}
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Switch
            checked={recursive}
            onCheckedChange={setRecursive}
            disabled={isDownloading}
          />
          <label className="text-sm text-gray-700">Recursive download (include subdirectories)</label>
        </div>

        <Button 
          onClick={onDownload}
          disabled={isDownloading || !url.trim() || !folderName.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          size="lg"
        >
          {isDownloading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Downloading...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Start Download
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DownloadForm;
