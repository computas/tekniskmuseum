import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  name = 'ole';

  constructor() {}

  b64ToUint8Array(b64Image) {
    const img = atob(b64Image.split(',')[1]);
    const imgBuffer: number[] = [];
    let i = 0;
    while (i < img.length) {
      imgBuffer.push(img.charCodeAt(i));
      i++;
    }
    return new Uint8Array(imgBuffer);
  }

  resize(b64Image, sx, sy, sw, sh): Observable<string> {
    return new Observable((observer) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('getContext failed');
      }
      img.onload = () => {
        canvas.width = 256;
        canvas.height = 256;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
        observer.next(canvas.toDataURL('image/png', 1));
      };
      img.src = b64Image;
    });
  }

  createFormData(dataUrl) {
    const u8Image = this.b64ToUint8Array(dataUrl);
    const blob = new Blob([u8Image], {
      type: 'image/png',
    });
    const formData = new FormData();
    formData.append('image', blob, 'image.png');
    formData.append('name', this.name);
    return formData;
  }
}
