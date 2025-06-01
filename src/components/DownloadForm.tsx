
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText, Loader2, Folder } from 'lucide-react';

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
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Download Configuration</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Directory URL</label>
          <Input
            placeholder="http://example.com/folder/"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
            disabled={isDownloading}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Folder Name</label>
          <div className="flex items-center space-x-2">
            <Folder className="h-4 w-4 text-slate-400" />
            <Input
              placeholder="My Downloads"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              disabled={isDownloading}
            />
          </div>
          <p className="text-xs text-slate-400">Files will be saved to: downloads/{folderName}</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Switch
            checked={recursive}
            onCheckedChange={setRecursive}
            disabled={isDownloading}
          />
          <label className="text-sm text-slate-300">Recursive download (include subdirectories)</label>
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
