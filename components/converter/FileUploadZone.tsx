'use client';

import React from 'react';
import { Upload, Image, FileImage } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadZoneProps {
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hasFiles: boolean;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
  hasFiles,
}) => {
  return (
    <div className={cn(
      "relative border-2 border-dashed rounded-xl p-8 transition-all duration-300",
      "hover:border-blue-400 hover:bg-blue-50/50",
      isDragging 
        ? "border-blue-500 bg-blue-50 scale-105 shadow-lg" 
        : "border-gray-300 bg-gray-50/50",
      hasFiles && "border-green-400 bg-green-50/30"
    )}
    onDragOver={onDragOver}
    onDragLeave={onDragLeave}
    onDrop={onDrop}
    >
      <input
        type="file"
        multiple
        accept="image/jpeg,image/jpg"
        onChange={onFileSelect}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      
      <div className="text-center space-y-4">
        <div className={cn(
          "inline-flex items-center justify-center w-16 h-16 rounded-full transition-all duration-300",
          isDragging ? "bg-blue-500 scale-110" : "bg-gradient-to-br from-blue-500 to-purple-600",
          hasFiles && "bg-gradient-to-br from-green-500 to-emerald-600"
        )}>
          {hasFiles ? (
            <FileImage className="w-8 h-8 text-white" />
          ) : isDragging ? (
            <Upload className="w-8 h-8 text-white animate-bounce" />
          ) : (
            <Image className="w-8 h-8 text-white" />
          )}
        </div>
        
        <div>
          <p className="text-lg font-semibold text-gray-700 mb-2">
            {hasFiles ? "Add more JPG images" : "Drop your JPG images here"}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            or click to browse your files
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-white rounded-lg border shadow-sm">
            <Upload className="w-4 h-4 mr-2 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">Choose Files</span>
          </div>
        </div>
        
        <p className="text-xs text-gray-400">
          Supports: JPG, JPEG files up to 10MB each
        </p>
      </div>
    </div>
  );
};