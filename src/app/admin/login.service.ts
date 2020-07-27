import { endpoints } from '../shared/models/endpoints';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  baseUrl = endpoints.TEKNISKBACKEND;

  constructor(private router: Router, private http: HttpClient) {}

  login(username, password) {
    const formData = new FormData();
    formData.append('password', password);
    formData.append('username', username);
    return this.attemptLogin(formData);
  }

  signOut() {
    this.router.navigate(['admin']);
  }

  isAuthenticated() {
    return this.http.post(`http://localhost:8000/${endpoints.ADMIN}/${endpoints.PING}`, {});
  }

  attemptLogin(formData) {
    return this.http.post(`http://localhost:8000/${endpoints.AUTH}`, formData);
  }

  revertDataset() {
    return this.http.post(`http://localhost:8000/${endpoints.ADMIN}/${endpoints.CLEARTRAINSET}`, {});
  }

  retrain() {
    return this.http.post(`http://localhost:8000/${endpoints.ADMIN}/${endpoints.TRAINML}`, {});
  }

  clearHighScore() {
    return this.http.post(`http://localhost:8000/${endpoints.ADMIN}/${endpoints.DROPTABLE}`, {});
  }

  getStatus() {
    return this.http.post(`http://localhost:8000/${endpoints.ADMIN}/${endpoints.GETSTATUS}`, {});
  }
}