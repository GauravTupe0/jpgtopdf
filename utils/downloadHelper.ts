import JSZip from 'jszip';

export class DownloadHelper {
  static downloadFile(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  
  static async downloadAsZip(files: Array<{ blob: Blob; filename: string }>, zipName: string = 'converted-images.zip') {
    const zip = new JSZip();
    
    files.forEach(({ blob, filename }) => {
      zip.file(filename, blob);
    });
    
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    this.downloadFile(zipBlob, zipName);
  }
}