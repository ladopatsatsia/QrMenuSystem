import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ImageService {
  resizeImage(file: File, maxWidth: number = 800, maxHeight: number = 800): Promise<Blob> {
    return new Promise((resolve, reject) => {
      console.log('Resizing image:', file.name, 'size:', file.size);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        console.log('File read as data URL');
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          console.log('Image object loaded', img.width, 'x', img.height);
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Canvas to Blob failed'));
          }, 'image/jpeg', 0.8);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  }
}
