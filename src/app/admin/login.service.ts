import { endpoints } from '../shared/models/endpoints';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  baseUrl = endpoints.TEKNISKBACKEND;
  private _loggedIn = false;
  constructor(private http: HttpClient) {}

  login(username, password) {
    const formData = new FormData();
    formData.append('password', password);
    formData.append('username', username);
    return this.attemptLogin(formData);
  }

  isLoggedIn() {
    return this._loggedIn;
  }

  setLoggedIn() {
    this._loggedIn = true;
  }

  signOut() {
    this._loggedIn = false;
    return this.http.post(`${endpoints.TEKNISKBACKEND}/${endpoints.ADMIN}/${endpoints.LOGOUT}`, {});
  }

  isAuthenticated() {
    return this.http.post(`${endpoints.TEKNISKBACKEND}/${endpoints.ADMIN}/${endpoints.PING}`, {});
  }

  attemptLogin(formData) {
    return this.http.post(`${endpoints.TEKNISKBACKEND}/${endpoints.AUTH}`, formData);
  }

  revertDataset() {
    return this.http.post(`${endpoints.TEKNISKBACKEND}/${endpoints.ADMIN}/${endpoints.CLEARTRAINSET}`, {});
  }

  retrain() {
    return this.http.post(`${endpoints.TEKNISKBACKEND}/${endpoints.ADMIN}/${endpoints.TRAINML}`, {});
  }

  clearHighScore() {
    return this.http.post(`${endpoints.TEKNISKBACKEND}/${endpoints.ADMIN}/${endpoints.DROPTABLE}`, {});
  }

  getStatus() {
    return this.http.post(`${endpoints.TEKNISKBACKEND}/${endpoints.ADMIN}/${endpoints.GETSTATUS}`, {});
  }
}
