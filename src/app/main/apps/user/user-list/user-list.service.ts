import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from "rxjs/operators";
import {Useratribute} from "../Useratribute";
import {environment} from "../../../../../environments/environment";

@Injectable()
export class UserListService implements Resolve<any> {
    public rows: any;
    public onUserListChanged: BehaviorSubject<any>;


    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(private _httpClient: HttpClient) {
        // Set the defaults
        this.onUserListChanged = new BehaviorSubject({});
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
            this._httpClient.get(`${environment.apiUrl}/api/users/getAllUsers`, httpOptions).subscribe(
                (response: any) => {
                    this.rows = response.users;
                    console.log('User data from service:', this.rows);
                    this.onUserListChanged.next(this.rows);
                    resolve(this.rows);
                },
                (error) => {
                    console.error('Error fetching user data:', error);
                    reject(error);
                }
            );
        });
    }


    addUser(data: Useratribute): Observable<Useratribute> {
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.token}`  // Change 'token' to 'Authorization'
            })
        };
        let url = `${environment.apiUrl}/register`;
        return this._httpClient.post<Useratribute>(url, data, httpOptions).pipe(
            map(response => {
                this.getDataTableRows();
                return response;
            })
        );
    }


    deleteUser(id: number): Observable<Useratribute> {
        return this._httpClient.delete<Useratribute>("http://localhost:3000/posts/" + id);

    }

    disableOrEnableUser(id: string): Observable<Useratribute> {
        console.log(id)
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.token}`  // Change 'token' to 'Authorization'
            })
        };
        let url = `${environment.apiUrl}/api/users/changeUserStatus/${id}`;
        return this._httpClient.put<Useratribute>(url, {}, httpOptions).pipe(
            map(response => {
                this.getDataTableRows(); // fetch the data again after successfully adding a user
                return response;
            })
        );

    }
}
