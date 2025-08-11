'use client';

import React from 'react';
import { FileWithPreview } from '@/types';
import { Play, Download, Trash2, RotateCcw } from 'lucide-react';
import { DownloadHelper } from '@/utils/downloadHelper';

interface BatchActionsProps {
  files: FileWithPreview[];
  onConvertAll: () => void;
  onClearAll: () => void;
  onRetryFailed: () => void;
  isConverting: boolean;
}

export const BatchActions: React.FC<BatchActionsProps> = ({
  files,
  onConvertAll,
  onClearAll,
  onRetryFailed,
  isConverting,
}) => {
  const completedFiles = files.filter(f => f.status === 'completed');
  const pendingFiles = files.filter(f => f.status === 'pending');
  const errorFiles = files.filter(f => f.status === 'error');

  const handleDownloadAll = async () => {
    if (completedFiles.length === 0) return;

    const downloadPromises = completedFiles.map(async (file) => {
      if (!file.convertedUrl) return null;
      
      const response = await fetch(file.convertedUrl);
      const blob = await response.blob();
      const filename = file.file.name.replace(/\.[^/.]+$/, '.png');
      
      return { blob, filename };
    });

    const results = await Promise.all(downloadPromises);
    const validFiles = results.filter((result): result is { blob: Blob; filename: string } => result !== null);

    if (validFiles.length === 1) {
      DownloadHelper.downloadFile(validFiles[0].blob, validFiles[0].filename);
    } else if (validFiles.length > 1) {
      await DownloadHelper.downloadAsZip(validFiles, 'converted-images.zip');
    }
  };

  if (files.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Batch Actions</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Convert All */}
        {pendingFiles.length > 0 && (
          <button
            onClick={onConvertAll}
            disabled={isConverting}
            className="flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100"
          >
            <Play className="w-4 h-4" />
            <span>Convert All</span>
          </button>
        )}

        {/* Download All */}
        {completedFiles.length > 0 && (
          <button
            onClick={handleDownloadAll}
            className="flex items-center justify-center space-x-2 py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            <Download className="w-4 h-4" />
            <span>Download All</span>
          </button>
        )}

        {/* Retry Failed */}
        {errorFiles.length > 0 && (
          <button
            onClick={onRetryFailed}
            className="flex items-center justify-center space-x-2 py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retry Failed</span>
          </button>
        )}

        {/* Clear All */}
        <button
          onClick={onClearAll}
          className="flex items-center justify-center space-x-2 py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear All</span>
        </button>
      </div>
    </div>
  );
};