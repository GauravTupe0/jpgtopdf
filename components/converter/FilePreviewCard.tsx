'use client';

import React from 'react';
import { FileWithPreview } from '@/types';
import { X, Download, RotateCcw, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ImageConverter } from '@/utils/fileConverter';
import { DownloadHelper } from '@/utils/downloadHelper';

interface FilePreviewCardProps {
  file: FileWithPreview;
  onRemove: (id: string) => void;
  onRetry?: (file: FileWithPreview) => void;
}

export const FilePreviewCard: React.FC<FilePreviewCardProps> = ({
  file,
  onRemove,
  onRetry,
}) => {
  const handleDownload = async () => {
    if (file.convertedUrl) {
      const response = await fetch(file.convertedUrl);
      const blob = await response.blob();
      const filename = file.file.name.replace(/\.[^/.]+$/, '.png');
      DownloadHelper.downloadFile(blob, filename);
    }
  };

  const getStatusIcon = () => {
    switch (file.status) {
      case 'pending':
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
      case 'converting':
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusText = () => {
    switch (file.status) {
      case 'pending':
        return 'Ready to convert';
      case 'converting':
        return `Converting... ${file.progress}%`;
      case 'completed':
        return 'Converted successfully';
      case 'error':
        return file.error || 'Conversion failed';
    }
  };

  return (
    <div className={cn(
      "group relative bg-white rounded-xl shadow-sm border transition-all duration-300 hover:shadow-md",
      "overflow-hidden",
      file.status === 'completed' && "ring-2 ring-green-200",
      file.status === 'error' && "ring-2 ring-red-200"
    )}>
      {/* Remove Button */}
      <button
        onClick={() => onRemove(file.id)}
        className="absolute top-2 right-2 z-10 p-1.5 bg-black/50 hover:bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="w-4 h-4 text-white" />
      </button>

      {/* Image Preview */}
      <div className="aspect-square relative overflow-hidden">
        <img
          src={file.preview}
          alt={file.file.name}
          className="w-full h-full object-cover"
        />
        
        {/* Progress Overlay */}
        {file.status === 'converting' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center text-white">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
              <p className="text-sm font-medium">{file.progress}%</p>
            </div>
          </div>
        )}
        
        {/* Status Badge */}
        <div className={cn(
          "absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium",
          "backdrop-blur-sm",
          file.status === 'pending' && "bg-gray-500/80 text-white",
          file.status === 'converting' && "bg-blue-500/80 text-white",
          file.status === 'completed' && "bg-green-500/80 text-white",
          file.status === 'error' && "bg-red-500/80 text-white"
        )}>
          JPG → PNG
        </div>
      </div>

      {/* File Info */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-medium text-gray-900 text-sm truncate" title={file.file.name}>
            {file.file.name}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {ImageConverter.formatFileSize(file.file.size)}
          </p>
        </div>

        {/* Status */}
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="text-xs text-gray-600 flex-1">
            {getStatusText()}
          </span>
        </div>

        {/* Progress Bar */}
        {file.status === 'converting' && (
          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-300"
              style={{ width: `${file.progress}%` }}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          {file.status === 'completed' && file.convertedUrl && (
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center space-x-1 py-2 px-3 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors"
            >
              <Download className="w-3 h-3" />
              <span>Download PNG</span>
            </button>
          )}
          
          {file.status === 'error' && onRetry && (
            <button
              onClick={() => onRetry(file)}
              className="flex-1 flex items-center justify-center space-x-1 py-2 px-3 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};