import { endpoints } from '../shared/models/endpoints';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthStatus, LogData, StatusData } from '../shared/models/backend-interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  baseUrl = endpoints.TEKNISKBACKEND;
  private _loggedIn = false;
  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
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

  attemptLogin(formData: FormData): Observable<AuthStatus> {
    return this.http.post<AuthStatus>(`${endpoints.TEKNISKBACKEND}/${endpoints.AUTH}`, formData, {
      withCredentials: true,
    });
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
    return this.http.post<StatusData>(
      `${endpoints.TEKNISKBACKEND}/${endpoints.ADMIN}/${endpoints.GETSTATUS}`,
      {},
      {
        withCredentials: true,
      }
    );
  }

  getLogger() {
    return this.http.get<LogData[]>(
      `${endpoints.TEKNISKBACKEND}/${endpoints.ADMIN}/${endpoints.LOGGER}`,
      {
        withCredentials: true,
      }
    );
  }

  getStatisticsPerMonth(month: string, year: string): Observable<number> {
    return this.http.get<number>(
      `${endpoints.TEKNISKBACKEND}/${endpoints.ADMIN}/${endpoints.GETSTATISTICSMONTH}?month=${month}&year=${year}`,
      {
        withCredentials: true,
      }
    );
    }

  getStatisticsPerYear(year: string): Observable<number> {
    return this.http.get<number>(
      `${endpoints.TEKNISKBACKEND}/${endpoints.ADMIN}/${endpoints.GETSTATISTICSYEAR}?year=${year}`,
      {
        withCredentials: true,
      }
    );
    }
}