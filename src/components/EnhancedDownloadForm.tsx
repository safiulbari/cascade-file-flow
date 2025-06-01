
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Loader2, Folder, Settings, Filter, History, Sparkles } from 'lucide-react';

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

const EnhancedDownloadForm: React.FC<DownloadFormProps> = ({
  url,
  setUrl,
  folderName,
  setFolderName,
  recursive,
  setRecursive,
  isDownloading,
  onDownload
}) => {
  const [fileTypes, setFileTypes] = useState('all');
  const [maxFiles, setMaxFiles] = useState('');
  const [recentUrls] = useState([
    'https://example.com/files/',
    'https://server.domain.com/media/',
    'https://archive.org/downloads/'
  ]);

  const handleQuickFill = (quickUrl: string) => {
    setUrl(quickUrl);
  };

  return (
    <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border-slate-700/50 shadow-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Sparkles className="h-5 w-5 text-blue-400" />
            </div>
            <span className="text-xl">Smart Download Configuration</span>
          </div>
          <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
            Pro Mode
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-700/50">
            <TabsTrigger value="basic" className="data-[state=active]:bg-blue-600">
              <FileText className="h-4 w-4 mr-2" />
              Basic
            </TabsTrigger>
            <TabsTrigger value="advanced" className="data-[state=active]:bg-purple-600">
              <Settings className="h-4 w-4 mr-2" />
              Advanced
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-orange-600">
              <History className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center">
                <Folder className="h-4 w-4 mr-2" />
                Directory URL
              </label>
              <Input
                placeholder="https://example.com/folder/ or paste any directory URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                disabled={isDownloading}
              />
              <div className="text-xs text-slate-400">
                Supports: h5ai, Apache directory listing, nginx autoindex, and more
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Download Folder Name</label>
              <Input
                placeholder="My Amazing Downloads"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-purple-500 focus:ring-purple-500/20"
                disabled={isDownloading}
              />
              <p className="text-xs text-slate-400">
                📁 Files will be saved to: <span className="text-blue-400 font-mono">downloads/{folderName || 'your-folder'}</span>
              </p>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  File Type Filter
                </label>
                <Select value={fileTypes} onValueChange={setFileTypes}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all">All Files</SelectItem>
                    <SelectItem value="media">Media Only (video, audio, images)</SelectItem>
                    <SelectItem value="documents">Documents Only (pdf, doc, txt)</SelectItem>
                    <SelectItem value="archives">Archives Only (zip, rar, 7z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Max Files Limit</label>
                <Input
                  placeholder="e.g., 100 (leave empty for no limit)"
                  value={maxFiles}
                  onChange={(e) => setMaxFiles(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                  disabled={isDownloading}
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
              <div className="space-y-1">
                <div className="text-sm font-medium text-slate-300">Recursive Download</div>
                <div className="text-xs text-slate-400">Include all subdirectories and nested folders</div>
              </div>
              <Switch
                checked={recursive}
                onCheckedChange={setRecursive}
                disabled={isDownloading}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-slate-300">Recent Downloads</h3>
              {recentUrls.map((recentUrl, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/50 hover:bg-slate-700/50 transition-colors cursor-pointer"
                  onClick={() => handleQuickFill(recentUrl)}
                >
                  <span className="text-sm text-slate-300 font-mono">{recentUrl}</span>
                  <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                    Use
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 pt-6 border-t border-slate-700/50">
          <Button 
            onClick={onDownload}
            disabled={isDownloading || !url.trim() || !folderName.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg font-semibold rounded-xl shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:transform-none"
            size="lg"
          >
            {isDownloading ? (
              <>
                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                Downloading Magic in Progress...
              </>
            ) : (
              <>
                <Download className="mr-3 h-5 w-5" />
                Start Epic Download Journey
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedDownloadForm;
