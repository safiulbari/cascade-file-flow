
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import DownloadItem from './DownloadItem';

interface DownloadStatus {
  id: string;
  filename: string;
  status: 'queued' | 'downloading' | 'completed' | 'failed';
  progress?: number;
  size?: string;
  error?: string;
}

interface DownloadProgressProps {
  downloads: DownloadStatus[];
}

const DownloadProgress: React.FC<DownloadProgressProps> = ({ downloads }) => {
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Download Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-3">
            {downloads.map((download) => (
              <DownloadItem key={download.id} download={download} />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default DownloadProgress;
