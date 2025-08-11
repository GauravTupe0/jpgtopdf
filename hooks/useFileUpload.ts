'use client';

import { useState, useCallback } from 'react';
import { FileWithPreview } from '@/types';
import { ImageConverter } from '@/utils/fileConverter';

export const useFileUpload = () => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const generateFileId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

  const processFiles = useCallback((fileList: FileList | File[]) => {
    const validFiles: FileWithPreview[] = [];
    
    Array.from(fileList).forEach((file) => {
      if (ImageConverter.validateImageFile(file)) {
        const fileWithPreview: FileWithPreview = {
          file,
          id: generateFileId(),
          preview: URL.createObjectURL(file),
          status: 'pending',
          progress: 0,
        };
        validFiles.push(fileWithPreview);
      }
    });
    
    setFiles(prev => [...prev, ...validFiles]);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      if (fileToRemove?.convertedUrl) {
        URL.revokeObjectURL(fileToRemove.convertedUrl);
      }
      return prev.filter(f => f.id !== id);
    });
  }, []);

  const clearAllFiles = useCallback(() => {
    files.forEach(file => {
      if (file.preview) URL.revokeObjectURL(file.preview);
      if (file.convertedUrl) URL.revokeObjectURL(file.convertedUrl);
    });
    setFiles([]);
  }, [files]);

  const updateFileStatus = useCallback((id: string, updates: Partial<FileWithPreview>) => {
    setFiles(prev => prev.map(file => 
      file.id === id ? { ...file, ...updates } : file
    ));
  }, []);

  return {
    files,
    isDragging,
    setIsDragging,
    processFiles,
    removeFile,
    clearAllFiles,
    updateFileStatus,
  };
};