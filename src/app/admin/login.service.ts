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
    return this.http.post(
      `${endpoints.TEKNISKBACKEND}/${endpoints.ADMIN}/${endpoints.LOGOUT}`,
      {},
      {
        withCredentials: true,
      }
    );
  }

  isAuthenticated() {
    return this.http.post(
      `${endpoints.TEKNISKBACKEND}/${endpoints.ADMIN}/${endpoints.PING}`,
      {},
      {
        withCredentials: true,
      }
    );
  }

  attemptLogin(formData) {
    return this.http.post(`${endpoints.TEKNISKBACKEND}/${endpoints.AUTH}`, formData);
  }

  revertDataset() {
    return this.http.post(
      `${endpoints.TEKNISKBACKEND}/${endpoints.ADMIN}/${endpoints.CLEARTRAINSET}`,
      {},
      {
        withCredentials: true,
      }
    );
  }

  retrain() {
    return this.http.post(
      `${endpoints.TEKNISKBACKEND}/${endpoints.ADMIN}/${endpoints.TRAINML}`,
      {},
      {
        withCredentials: true,
      }
    );
  }

  clearHighScore() {
    return this.http.post(
      `${endpoints.TEKNISKBACKEND}/${endpoints.ADMIN}/${endpoints.DROPTABLE}`,
      {},
      {
        withCredentials: true,
      }
    );
  }

  getStatus() {
    return this.http.post(
      `${endpoints.TEKNISKBACKEND}/${endpoints.ADMIN}/${endpoints.GETSTATUS}`,
      {},
      {
        withCredentials: true,
      }
    );
  }
}
