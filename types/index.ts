export interface FileWithPreview {
  file: File;
  id: string;
  preview: string;
  status: 'pending' | 'converting' | 'completed' | 'error';
  progress: number;
  convertedUrl?: string;
  error?: string;
}

export interface ConversionSettings {
  quality: number;
  format: 'png';
  backgroundColor: string;
}