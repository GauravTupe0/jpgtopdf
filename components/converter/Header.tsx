'use client';

import React from 'react';
import { ImageIcon, Zap, Shield, Download } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <div className="text-center space-y-6 mb-12">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg">
        <ImageIcon className="w-10 h-10 text-white" />
      </div>
      
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          JPG to PNG Converter
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Convert your JPEG images to PNG format quickly and securely. 
          All conversions happen locally in your browser for maximum privacy.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-blue-600" />
          <span>Fast Conversion</span>
        </div>
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-green-600" />
          <span>100% Private</span>
        </div>
        <div className="flex items-center space-x-2">
          <Download className="w-4 h-4 text-purple-600" />
          <span>No Upload Required</span>
        </div>
      </div>
    </div>
  );
};