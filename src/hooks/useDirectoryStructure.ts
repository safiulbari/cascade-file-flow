
import { useState, useEffect } from 'react';

interface DirectoryItem {
  name: string;
  type: 'directory' | 'file';
  path: string;
  children?: DirectoryItem[];
  selected?: boolean;
}

export const useDirectoryStructure = () => {
  const [directoryStructure, setDirectoryStructure] = useState<DirectoryItem[]>([]);
  
  const saveToLocalStorage = (structure: DirectoryItem[]) => {
    localStorage.setItem('directoryStructure', JSON.stringify(structure));
  };

  const loadFromLocalStorage = (): DirectoryItem[] => {
    const saved = localStorage.getItem('directoryStructure');
    return saved ? JSON.parse(saved) : [];
  };

  const fetchDirectoryStructure = async (url: string): Promise<DirectoryItem[]> => {
    try {
      const response = await fetch('http://localhost:3001/api/directory-structure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch directory structure');
      }

      const structure = await response.json();
      saveToLocalStorage(structure);
      setDirectoryStructure(structure);
      return structure;
    } catch (error) {
      console.error('Error fetching directory structure:', error);
      // Return mock data for development
      const mockStructure: DirectoryItem[] = [
        {
          name: 'images',
          type: 'directory',
          path: '/images',
          selected: false,
          children: [
            { name: 'photo1.jpg', type: 'file', path: '/images/photo1.jpg' },
            { name: 'photo2.jpg', type: 'file', path: '/images/photo2.jpg' },
            {
              name: 'thumbnails',
              type: 'directory',
              path: '/images/thumbnails',
              selected: false,
              children: [
                { name: 'thumb1.jpg', type: 'file', path: '/images/thumbnails/thumb1.jpg' },
                { name: 'thumb2.jpg', type: 'file', path: '/images/thumbnails/thumb2.jpg' }
              ]
            }
          ]
        },
        {
          name: 'documents',
          type: 'directory',
          path: '/documents',
          selected: false,
          children: [
            { name: 'readme.txt', type: 'file', path: '/documents/readme.txt' },
            { name: 'manual.pdf', type: 'file', path: '/documents/manual.pdf' }
          ]
        },
        {
          name: 'videos',
          type: 'directory',
          path: '/videos',
          selected: false,
          children: [
            { name: 'intro.mp4', type: 'file', path: '/videos/intro.mp4' }
          ]
        }
      ];
      
      saveToLocalStorage(mockStructure);
      setDirectoryStructure(mockStructure);
      return mockStructure;
    }
  };

  useEffect(() => {
    const saved = loadFromLocalStorage();
    if (saved.length > 0) {
      setDirectoryStructure(saved);
    }
  }, []);

  return {
    directoryStructure,
    fetchDirectoryStructure,
    setDirectoryStructure
  };
};
