import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import { environment } from 'environments/environment';
import { User } from 'app/auth/models';
import {Observable} from "rxjs";

@Injectable({ providedIn: 'root' })
export class UserService {
  /**
   *
   * @param {HttpClient} _http
   */
  constructor(private _http: HttpClient) {}

  /**
   * Get all users
   */
  getAll() {
    return this._http.get<User[]>(`${environment.apiUrl}/users`);
  }

  /**
   * Get user by id
   */
  getById(id: number) {
    return this._http.get<User>(`${environment.apiUrl}/users/${id}`);
  }

  getUserStatistics(): Observable<any> {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentUser.token}`  // Change 'token' to 'Authorization'
      })
    };
    let url = `${environment.apiUrl}/api/users/userStatistics`;
    return this._http.get(url, httpOptions);
  }
}
