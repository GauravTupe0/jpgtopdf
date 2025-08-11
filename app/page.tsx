'use client';

import React, { useState } from 'react';
import { Header } from '@/components/converter/Header';
import { FileUploadZone } from '@/components/converter/FileUploadZone';
import { FilePreviewCard } from '@/components/converter/FilePreviewCard';
import { ConversionStats } from '@/components/converter/ConversionStats';
import { BatchActions } from '@/components/converter/BatchActions';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useImageConverter } from '@/hooks/useImageConverter';
import { FileWithPreview } from '@/types';

export default function Home() {
  const {
    files,
    isDragging,
    setIsDragging,
    processFiles,
    removeFile,
    clearAllFiles,
    updateFileStatus,
  } = useFileUpload();

  const { convertBatch } = useImageConverter();
  const [isConverting, setIsConverting] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const handleConvertAll = async () => {
    setIsConverting(true);
    await convertBatch(files, updateFileStatus);
    setIsConverting(false);
  };

  const handleRetryFailed = async () => {
    const failedFiles = files.filter(f => f.status === 'error');
    
    // Reset failed files to pending
    failedFiles.forEach(file => {
      updateFileStatus(file.id, { status: 'pending', progress: 0, error: undefined });
    });

    // Convert them
    setIsConverting(true);
    await convertBatch(failedFiles, updateFileStatus);
    setIsConverting(false);
  };

  const handleRetryFile = async (file: FileWithPreview) => {
    updateFileStatus(file.id, { status: 'pending', progress: 0, error: undefined });
    setIsConverting(true);
    await convertBatch([file], updateFileStatus);
    setIsConverting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Header />
        
        <div className="space-y-8">
          {/* Upload Zone */}
          <div className="max-w-4xl mx-auto">
            <FileUploadZone
              isDragging={isDragging}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onFileSelect={handleFileSelect}
              hasFiles={files.length > 0}
            />
          </div>

          {files.length > 0 && (
            <>
              {/* Stats */}
              <div className="max-w-4xl mx-auto">
                <ConversionStats files={files} />
              </div>

              {/* Batch Actions */}
              <div className="max-w-4xl mx-auto">
                <BatchActions
                  files={files}
                  onConvertAll={handleConvertAll}
                  onClearAll={clearAllFiles}
                  onRetryFailed={handleRetryFailed}
                  isConverting={isConverting}
                />
              </div>

              {/* File Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {files.map((file) => (
                  <FilePreviewCard
                    key={file.id}
                    file={file}
                    onRemove={removeFile}
                    onRetry={handleRetryFile}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-gray-500">
          <p>All conversions happen in your browser. Your files never leave your device.</p>
        </footer>
      </div>
    </div>
  );
}