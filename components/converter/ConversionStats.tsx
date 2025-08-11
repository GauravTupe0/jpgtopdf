'use client';

import React from 'react';
import { FileWithPreview } from '@/types';
import { FileImage, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface ConversionStatsProps {
  files: FileWithPreview[];
}

export const ConversionStats: React.FC<ConversionStatsProps> = ({ files }) => {
  const totalFiles = files.length;
  const pendingFiles = files.filter(f => f.status === 'pending').length;
  const convertingFiles = files.filter(f => f.status === 'converting').length;
  const completedFiles = files.filter(f => f.status === 'completed').length;
  const errorFiles = files.filter(f => f.status === 'error').length;

  if (totalFiles === 0) return null;

  const stats = [
    { label: 'Total', value: totalFiles, icon: FileImage, color: 'text-gray-600 bg-gray-100' },
    { label: 'Pending', value: pendingFiles, icon: Clock, color: 'text-yellow-600 bg-yellow-100' },
    { label: 'Converting', value: convertingFiles, icon: Clock, color: 'text-blue-600 bg-blue-100' },
    { label: 'Completed', value: completedFiles, icon: CheckCircle2, color: 'text-green-600 bg-green-100' },
    { label: 'Failed', value: errorFiles, icon: AlertCircle, color: 'text-red-600 bg-red-100' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Progress</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="text-center">
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${stat.color} mb-2`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          );
        })}
      </div>
      
      {totalFiles > 0 && (
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Overall Progress</span>
            <span>{Math.round((completedFiles / totalFiles) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-green-600 rounded-full transition-all duration-500"
              style={{ width: `${(completedFiles / totalFiles) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};