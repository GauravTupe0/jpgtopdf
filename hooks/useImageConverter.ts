'use client';

import { useCallback } from 'react';
import { FileWithPreview } from '@/types';
import { ImageConverter } from '@/utils/fileConverter';

export const useImageConverter = () => {
  const convertFile = useCallback(async (
    fileWithPreview: FileWithPreview,
    onProgress: (id: string, progress: number) => void,
    onComplete: (id: string, convertedUrl: string) => void,
    onError: (id: string, error: string) => void
  ) => {
    try {
      onProgress(fileWithPreview.id, 25);
      
      const convertedBlob = await ImageConverter.convertJpgToPng(fileWithPreview.file);
      onProgress(fileWithPreview.id, 75);
      
      const convertedUrl = URL.createObjectURL(convertedBlob);
      onProgress(fileWithPreview.id, 100);
      
      setTimeout(() => {
        onComplete(fileWithPreview.id, convertedUrl);
      }, 300);
      
    } catch (error) {
      onError(fileWithPreview.id, error instanceof Error ? error.message : 'Conversion failed');
    }
  }, []);

  const convertBatch = useCallback(async (
    files: FileWithPreview[],
    updateFileStatus: (id: string, updates: Partial<FileWithPreview>) => void
  ) => {
    const pendingFiles = files.filter(f => f.status === 'pending');
    
    for (const file of pendingFiles) {
      updateFileStatus(file.id, { status: 'converting', progress: 0 });
      
      await convertFile(
        file,
        (id, progress) => updateFileStatus(id, { progress }),
        (id, convertedUrl) => updateFileStatus(id, { status: 'completed', convertedUrl, progress: 100 }),
        (id, error) => updateFileStatus(id, { status: 'error', error, progress: 0 })
      );
      
      // Small delay between conversions
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }, [convertFile]);

  return { convertFile, convertBatch };
};