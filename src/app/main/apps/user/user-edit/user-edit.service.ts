import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';

import {BehaviorSubject, Observable} from 'rxjs';
import {Useratribute} from "../Useratribute";
import {environment} from "../../../../../environments/environment";
import {User} from "../../../../auth/models";

@Injectable()
export class UserEditService implements Resolve<any> {
    public apiData: any;
    public onUserEditChanged: BehaviorSubject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(private _httpClient: HttpClient) {
        // Set the defaults
        this.onUserEditChanged = new BehaviorSubject({});
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
            Promise.all([this.getApiData()]).then(() => {
                resolve();
            }, reject);
        });
    }

    /**
     * Get API Data
     */
    // getApiData(): Promise<any[]> {
    //   return new Promise((resolve, reject) => {
    //     this._httpClient.get('http://localhost:3000/posts').subscribe((response: any) => {
    //       this.apiData = response;
    //       this.onUserEditChanged.next(this.apiData);
    //       resolve(this.apiData);
    //     }, reject);
    //   });
    // }

    getApiData(): Promise<any[]> {
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.token}`  // Change 'token' to 'Authorization'
            })
        };
        return new Promise((resolve, reject) => {
            let url = `${environment.apiUrl}/api/users/getAllUsers`;

            this._httpClient.get(url, httpOptions).subscribe((response: any) => {
                this.apiData = response.users;
                console.log('User data from service:', this.apiData);
                this.onUserEditChanged.next(this.apiData);
                resolve(this.apiData);
            }, reject);
        });
    }

    updateUser(data: Useratribute, id: string): Observable<Useratribute> {
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.token}`  // Change 'token' to 'Authorization'
            })
        };
        let url = `${environment.apiUrl}/api/users/updateUserByAdmin/`;
        return this._httpClient.put<Useratribute>(url + id, data, httpOptions);
    }

    // Method to update localStorage
    updateLocalStorage(userData) {
        const userJson = JSON.stringify(userData);
        localStorage.setItem('currentUser', userJson);
    }
    updateLocalStorageField(fieldName, value) {
        let userData = JSON.parse(localStorage.getItem('currentUser'));

        // Check if the field exists in the userData
        if(userData.hasOwnProperty(fieldName)) {
            userData[fieldName] = value;
            this.updateLocalStorage(userData);
        } else {
            console.log(`Field ${fieldName} does not exist in user data.`);
        }
    }

    updateUserCredintial(data: any): Observable<any> {
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.token}`  // Change 'token' to 'Authorization'
            })
        };
        return this._httpClient.put<any>(`${environment.apiUrl}/api/users`, data, httpOptions);
    }

    updateUserPasswordCredintial(data: any): Observable<any> {
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.token}`  // Change 'token' to 'Authorization'
            })
        };
        console.log(currentUser.token);
        console.log(data);
        // return ;
        return this._httpClient.put<any>(`${environment.apiUrl}/api/users/changePassword`, data, httpOptions);
    }
}
