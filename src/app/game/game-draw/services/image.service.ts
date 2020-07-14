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

  resize(b64Image, croppedCoordinates, imageSize=256): Observable<string> {
    return new Observable((observer) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('getContext failed');
      }

      img.onload = () => {
        canvas.width = imageSize;
        canvas.height = imageSize;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const [sx, sy, sw, sh] = croppedCoordinates;
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
        observer.next(canvas.toDataURL('image/png', 1));
      };
      img.src = b64Image;
    });
  }

  crop(minX, minY, maxX, maxY, userDrawLineWidth) {
    const paddingForLineWidth = userDrawLineWidth / 2;
    const paddingExtra = 20;
    const paddingTotal = paddingForLineWidth + paddingExtra;

    const userDrawingWidth = maxX - minX;
    const userDrawingHeight = maxY - minY;

    const squareCenterX = minX + userDrawingWidth / 2;
    const squareCenterY = minY + userDrawingHeight / 2;
    const squareSize = Math.max(userDrawingWidth, userDrawingHeight);

    const sx = squareCenterX - squareSize / 2 - paddingTotal;
    const sy = squareCenterY - squareSize / 2 - paddingTotal;
    const sw = squareSize + paddingTotal * 2;
    const sh = squareSize + paddingTotal * 2;

    return [sx, sy, sw, sh];
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
