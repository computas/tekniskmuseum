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

  resize(b64Image) {
    return new Observable((observer) => {
      const img = new Image();
      const c = document.createElement('canvas');
      const ctx = c.getContext('2d');
      if (!ctx) {
        throw new Error('getContext failed');
      }
      img.onload = () => {
        c.width = 256;
        c.height = 256;
        ctx.drawImage(img, 0, 0, c.width, c.height);
        observer.next(c.toDataURL('image/png', 1));
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
