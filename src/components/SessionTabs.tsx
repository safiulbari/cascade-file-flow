
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Edit2, Check, Plus } from 'lucide-react';
import { DownloadSession } from '@/types/download';

interface SessionTabsProps {
  sessions: DownloadSession[];
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onRenameSession: (sessionId: string, newName: string) => void;
  onCreateSession: () => void;
}

const SessionTabs: React.FC<SessionTabsProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onDeleteSession,
  onRenameSession,
  onCreateSession
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleStartEdit = (session: DownloadSession) => {
    setEditingId(session.id);
    setEditName(session.name);
  };

  const handleSaveEdit = () => {
    if (editingId && editName.trim()) {
      onRenameSession(editingId, editName.trim());
    }
    setEditingId(null);
    setEditName('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  return (
    <div className="bg-black/20 backdrop-blur-xl border-b border-white/10 p-2">
      <div className="flex items-center space-x-1 overflow-x-auto">
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg border transition-all ${
              activeSessionId === session.id
                ? 'bg-white/20 border-white/30 text-white'
                : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
            }`}
          >
            {editingId === session.id ? (
              <div className="flex items-center space-x-1">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="h-6 w-24 text-xs bg-white/10 border-white/20 text-white"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit();
                    if (e.key === 'Escape') handleCancelEdit();
                  }}
                  autoFocus
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleSaveEdit}
                  className="h-6 w-6 p-0 text-green-400 hover:text-green-300"
                >
                  <Check className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancelEdit}
                  className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => onSelectSession(session.id)}
                  className="text-xs font-medium truncate max-w-20"
                >
                  {session.name}
                </button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleStartEdit(session)}
                  className="h-5 w-5 p-0 text-white/60 hover:text-white/90"
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDeleteSession(session.id)}
                  className="h-5 w-5 p-0 text-red-400 hover:text-red-300"
                >
                  <X className="h-3 w-3" />
                </Button>
                {session.isDownloading && (
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                )}
              </>
            )}
          </div>
        ))}
        
        <Button
          size="sm"
          variant="outline"
          onClick={onCreateSession}
          className="h-7 bg-white/5 border-white/20 hover:bg-white/10 text-white/70 hover:text-white text-xs"
        >
          <Plus className="h-3 w-3 mr-1" />
          New
        </Button>
      </div>
    </div>
  );
};

export default SessionTabs;
