
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Loader2, Clipboard } from 'lucide-react';

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
  onDownload: () => void;
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
  onDownload
}) => {
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  return (
    <Card className="bg-white border border-gray-300 shadow-sm">
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-800">Directory URL</label>
            <div className="flex gap-2">
              <Input
                placeholder="http://example.com/folder/"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="bg-white border-gray-300 text-gray-900 placeholder-gray-400 flex-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                disabled={isDownloading}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handlePaste}
                disabled={isDownloading}
                className="shrink-0 border-gray-300 hover:bg-gray-50"
              >
                <Clipboard className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-800">Folder Name</label>
            <Input
              placeholder="My Downloads"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              disabled={isDownloading}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <label className="text-sm font-medium text-gray-700">Recursive download (include subdirectories)</label>
            <Switch
              checked={recursive}
              onCheckedChange={setRecursive}
              disabled={isDownloading}
            />
          </div>

          {recursive && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg ml-4">
              <label className="text-sm font-medium text-gray-700">Create subdirectory folders</label>
              <Switch
                checked={createSubfolders}
                onCheckedChange={setCreateSubfolders}
                disabled={isDownloading}
              />
            </div>
          )}
        </div>

        <Button 
          onClick={onDownload}
          disabled={isDownloading || !url.trim() || !folderName.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm h-11"
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
