
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Folder, File, ChevronRight, ChevronDown } from 'lucide-react';

interface DirectoryItem {
  name: string;
  type: 'directory' | 'file';
  path: string;
  children?: DirectoryItem[];
  selected?: boolean;
}

interface DirectorySelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedPaths: string[]) => void;
  directoryStructure: DirectoryItem[];
}

const DirectorySelector: React.FC<DirectorySelectorProps> = ({
  isOpen,
  onClose,
  onConfirm,
  directoryStructure
}) => {
  const [items, setItems] = useState<DirectoryItem[]>(directoryStructure);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  useEffect(() => {
    setItems(directoryStructure);
  }, [directoryStructure]);

  const toggleExpanded = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const updateSelection = (path: string, selected: boolean) => {
    const updateItemSelection = (items: DirectoryItem[]): DirectoryItem[] => {
      return items.map(item => {
        if (item.path === path) {
          return { ...item, selected };
        }
        if (item.children) {
          return { ...item, children: updateItemSelection(item.children) };
        }
        return item;
      });
    };
    setItems(updateItemSelection(items));
  };

  const getSelectedPaths = (items: DirectoryItem[]): string[] => {
    const selected: string[] = [];
    const traverse = (items: DirectoryItem[]) => {
      items.forEach(item => {
        if (item.selected && item.type === 'directory') {
          selected.push(item.path);
        }
        if (item.children) {
          traverse(item.children);
        }
      });
    };
    traverse(items);
    return selected;
  };

  const handleConfirm = () => {
    const selectedPaths = getSelectedPaths(items);
    onConfirm(selectedPaths);
    onClose();
  };

  const renderItem = (item: DirectoryItem, depth: number = 0) => {
    const isExpanded = expandedFolders.has(item.path);
    const paddingLeft = depth * 24;

    return (
      <div key={item.path}>
        <div 
          className="flex items-center py-2 hover:bg-gray-50 rounded-md"
          style={{ paddingLeft: `${paddingLeft + 8}px` }}
        >
          {item.type === 'directory' && (
            <button
              onClick={() => toggleExpanded(item.path)}
              className="mr-1 p-1 hover:bg-gray-200 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          )}
          
          <div className="flex items-center space-x-2 flex-1">
            {item.type === 'directory' ? (
              <Folder className="h-4 w-4 text-blue-600" />
            ) : (
              <File className="h-4 w-4 text-gray-600" />
            )}
            
            <span className="text-sm">{item.name}</span>
            
            {item.type === 'directory' && (
              <Checkbox
                checked={item.selected || false}
                onCheckedChange={(checked) => updateSelection(item.path, checked as boolean)}
                className="ml-auto"
              />
            )}
          </div>
        </div>
        
        {item.type === 'directory' && isExpanded && item.children && (
          <div>
            {item.children.map(child => renderItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Select Directories to Download</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-96 w-full border rounded-md p-4">
          {items.map(item => renderItem(item))}
        </ScrollArea>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Download Selected
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DirectorySelector;
