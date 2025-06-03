
import React, { useState, useEffect } from 'react';
import DownloadForm from '@/components/DownloadForm';
import DownloadProgress from '@/components/DownloadProgress';
import MacOSSidebar from '@/components/MacOSSidebar';
import SessionTabs from '@/components/SessionTabs';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useDownloadSessions } from '@/hooks/useDownloadSessions';

const Index = () => {
  const [url, setUrl] = useState('');
  const [folderName, setFolderName] = useState('');
  const [recursive, setRecursive] = useState(true);
  const [createSubfolders, setCreateSubfolders] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const {
    sessions,
    activeSession,
    activeSessionId,
    setActiveSessionId,
    createSession,
    deleteSession,
    renameSession,
    startDownload,
    clearAllSessions
  } = useDownloadSessions();

  // Show create form if no sessions exist
  useEffect(() => {
    setShowCreateForm(sessions.length === 0);
  }, [sessions.length]);

  const handleCreateSession = () => {
    if (!url.trim() || !folderName.trim()) return;
    
    const sessionId = createSession(folderName, url, recursive, createSubfolders);
    startDownload(sessionId);
    setShowCreateForm(false);
    
    // Reset form
    setUrl('');
    setFolderName('');
    setRecursive(true);
    setCreateSubfolders(false);
  };

  const handleStartNewDownload = () => {
    if (activeSession && !activeSession.isDownloading) {
      startDownload(activeSession.id);
    }
  };

  const pauseDownload = (id: string) => {
    // Pause functionality would be implemented here
    console.log('Pause download:', id);
  };

  const resumeDownload = (id: string) => {
    // Resume functionality would be implemented here
    console.log('Resume download:', id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl flex">
      {/* macOS Style Sidebar */}
      <MacOSSidebar 
        downloads={activeSession?.downloads || []} 
        summary={activeSession?.summary || null} 
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* macOS Style Title Bar */}
        <div className="h-10 bg-black/20 backdrop-blur-xl border-b border-white/10 flex items-center px-4">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors cursor-pointer"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors cursor-pointer"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors cursor-pointer"></div>
          </div>
          <div className="flex-1 text-center text-sm font-medium text-white/90">
            Download Manager
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllSessions}
              className="h-7 bg-red-500/20 border-red-400/30 hover:bg-red-500/30 text-red-300 text-xs"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Clear All
            </Button>
          </div>
        </div>

        {/* Session Tabs */}
        {sessions.length > 0 && (
          <SessionTabs
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSelectSession={setActiveSessionId}
            onDeleteSession={deleteSession}
            onRenameSession={renameSession}
            onCreateSession={() => setShowCreateForm(true)}
          />
        )}

        {/* Content */}
        <div className="flex-1 p-4 space-y-4 overflow-auto">
          {/* Create New Session Form */}
          {showCreateForm && (
            <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-4">
              <h3 className="text-white/90 font-medium mb-3">Create New Download Session</h3>
              <DownloadForm
                url={url}
                setUrl={setUrl}
                folderName={folderName}
                setFolderName={setFolderName}
                recursive={recursive}
                setRecursive={setRecursive}
                createSubfolders={createSubfolders}
                setCreateSubfolders={setCreateSubfolders}
                isDownloading={false}
                onDownload={handleCreateSession}
              />
              {sessions.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCreateForm(false)}
                  className="mt-2 bg-white/5 border-white/20 hover:bg-white/10 text-white/70 text-xs"
                >
                  Cancel
                </Button>
              )}
            </div>
          )}

          {/* Active Session Controls */}
          {activeSession && !showCreateForm && (
            <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white/90 font-medium">
                  {activeSession.name}
                </h3>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCreateForm(true)}
                    className="h-7 bg-white/5 border-white/20 hover:bg-white/10 text-white/70 text-xs"
                  >
                    New Session
                  </Button>
                  {!activeSession.isDownloading && (
                    <Button
                      size="sm"
                      onClick={handleStartNewDownload}
                      className="h-7 bg-blue-500/80 hover:bg-blue-500 text-white text-xs"
                    >
                      Start Download
                    </Button>
                  )}
                </div>
              </div>
              <div className="text-sm text-white/60">
                <div>URL: {activeSession.url}</div>
                <div>Recursive: {activeSession.recursive ? 'Yes' : 'No'}</div>
                <div>Create Subfolders: {activeSession.createSubfolders ? 'Yes' : 'No'}</div>
              </div>
            </div>
          )}

          {/* Progress */}
          {activeSession && activeSession.downloads.length > 0 && (
            <DownloadProgress 
              downloads={activeSession.downloads} 
              onPause={pauseDownload}
              onResume={resumeDownload}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
