import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import {environment} from "../../../../environments/environment";

@Injectable()
export class AccountSettingsService implements Resolve<any> {
  rows: any;
  onSettingsChanged: BehaviorSubject<any>;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.onSettingsChanged = new BehaviorSubject({});
  }

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise<void>((resolve, reject) => {
      Promise.all([this.getDataTableRows()]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Get rows
   */
  getDataTableRows(): Promise<any[]> {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentUser.token}`  // Change 'token' to 'Authorization'
      })
    };

    return new Promise((resolve, reject) => {
      let url = `${environment.apiUrl}/api/users`
      this._httpClient.get(url, httpOptions).subscribe((response: any) => {
        this.rows = response.user;
        console.log("current user data " + this.rows);
        this.onSettingsChanged.next(this.rows);
        resolve(this.rows);
      }, reject);
    });
  }
}
