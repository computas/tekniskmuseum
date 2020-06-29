import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DrawingService {
  baseUrl = 'https://tekniskback.azurewebsites.net';
  constructor(private http: HttpClient) {}

  submitAnswer(formdata, id) {
    return this.http.post<any>(
      'https://jsonplaceholder.typicode.com/posts',
      formdata
    );
  }

  startGame() {
    return this.http.get(`${this.baseUrl}/startGame`);
  }

  testEndpoint() {
    return this.http.get(`https://jsonplaceholder.typicode.com/posts/1`);
  }
}
