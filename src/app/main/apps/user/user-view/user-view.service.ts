import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import {environment} from "../../../../../environments/environment";

@Injectable()
export class UserViewService implements Resolve<any> {
  public rows: any;
  public onUserViewChanged: BehaviorSubject<any>;
  public id;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.onUserViewChanged = new BehaviorSubject({});
  }

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    let currentId = route.paramMap.get('id');
    return new Promise<void>((resolve, reject) => {
      Promise.all([this.getApiData(currentId)]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Get rows
   */
  getApiData(id: string): Promise<any[]> {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));


    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentUser.token}`  // Change 'token' to 'Authorization'
      })
    };
    const url = `${environment.apiUrl}/api/users/getUserById/${id}`;

    return new Promise((resolve, reject) => {
      this._httpClient.get(url, httpOptions).subscribe((response: any) => {
        this.rows = response.user;
        this.onUserViewChanged.next(this.rows);
        resolve(this.rows);
      }, reject);
    });
  }
}
