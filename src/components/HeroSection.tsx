
import React from 'react';
import { Download, Zap, Shield, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-8">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="p-3 rounded-full bg-blue-500/20 backdrop-blur-sm">
              <Download className="h-12 w-12 text-blue-400" />
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              FileFlow
            </h1>
          </div>
          
          <p className="text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            The most powerful web directory crawler and batch downloader. 
            <span className="text-blue-400 font-semibold"> Download entire directories</span> with 
            <span className="text-purple-400 font-semibold"> lightning speed</span> and 
            <span className="text-pink-400 font-semibold"> military-grade reliability</span>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <Zap className="h-8 w-8 text-yellow-400 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-white mb-2">Lightning Fast</h3>
              <p className="text-slate-400 text-sm">Optimized parallel downloads with smart queuing</p>
            </div>
            
            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <Shield className="h-8 w-8 text-green-400 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-white mb-2">Bulletproof</h3>
              <p className="text-slate-400 text-sm">Advanced error handling and automatic retries</p>
            </div>
            
            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <Globe className="h-8 w-8 text-blue-400 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-white mb-2">Universal</h3>
              <p className="text-slate-400 text-sm">Works with any web directory structure</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
            <Button 
              onClick={onGetStarted}
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-200"
            >
              Start Downloading
              <Download className="ml-2 h-5 w-5" />
            </Button>
            
            <div className="text-sm text-slate-400">
              No registration required • Free forever • Open source
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
