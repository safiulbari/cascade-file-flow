
import React from 'react';
import { Heart, Github, Coffee, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900/50 backdrop-blur-sm border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold text-white">FileFlow</span>
            </div>
            <p className="text-slate-400 text-sm">
              The most powerful web directory crawler and batch downloader. Built with love for the community.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Features</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>• Batch Downloads</li>
              <li>• Real-time Progress</li>
              <li>• Smart Filtering</li>
              <li>• Error Recovery</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Support</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>• Documentation</li>
              <li>• Community</li>
              <li>• Bug Reports</li>
              <li>• Feature Requests</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Connect</h3>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                <Coffee className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">
            © 2024 FileFlow. Made with <Heart className="h-4 w-4 inline text-red-500" /> for the community.
          </p>
          <p className="text-slate-400 text-sm mt-2 md:mt-0">
            Open source • Free forever • No tracking
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
