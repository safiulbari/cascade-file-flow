
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
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
    <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/90">Directory URL</label>
          <div className="flex gap-2">
            <Input
              placeholder="http://example.com/folder/"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="bg-white/5 border-white/20 text-white placeholder-white/50 flex-1 focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/50 h-9"
              disabled={isDownloading}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handlePaste}
              disabled={isDownloading}
              className="shrink-0 bg-white/5 border-white/20 hover:bg-white/10 text-white h-9 w-9"
            >
              <Clipboard className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/90">Folder Name</label>
          <Input
            placeholder="My Downloads"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            className="bg-white/5 border-white/20 text-white placeholder-white/50 focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/50 h-9"
            disabled={isDownloading}
          />
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
          <label className="text-sm font-medium text-white/90">Recursive download</label>
          <Switch
            checked={recursive}
            onCheckedChange={setRecursive}
            disabled={isDownloading}
          />
        </div>

        {recursive && (
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 ml-4">
            <label className="text-sm font-medium text-white/80">Create subdirectory folders</label>
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
        className="w-full bg-blue-600/80 hover:bg-blue-600 text-white shadow-lg backdrop-blur-sm h-10"
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
    </div>
  );
};

export default DownloadForm;
