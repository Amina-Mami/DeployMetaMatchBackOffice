import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';

import {environment} from 'environments/environment';
import {User, Role} from 'app/auth/models';
import {ToastrService} from 'ngx-toastr';

@Injectable({providedIn: 'root'})
export class AuthenticationService {
    //public
    public currentUser: Observable<User>;

    //private
    private currentUserSubject: BehaviorSubject<User>;

    /**
     *
     * @param {HttpClient} _http
     * @param {ToastrService} _toastrService
     */
    constructor(private _http: HttpClient, private _toastrService: ToastrService) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    // getter: currentUserValue
    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    /**
     *  Confirms if user is admin
     */
    get isAdmin() {
        return this.currentUser && this.currentUserSubject.value.role === Role.Admin;
    }

    /**
     *  Confirms if user is client
     */
    get isClient() {
        return this.currentUser && this.currentUserSubject.value.role === Role.Player;
    }

    /**
     * User login
     *
     * @param email
     * @param password
     * @returns user
     */
    login(email: string, password: string): Observable<any> {
        return this._http.post<any>(`${environment.apiUrl}/login`, {email, password}).pipe(
            map(user => this.handleSuccessfulLogin(user))
        );
    }

    verifyGoogleToken(idToken: string): Observable<any> {
        return this._http.post<any>(`${environment.apiUrl}/google-signin`, {token: idToken}).pipe(
            tap(user => {
                console.log('user b', user);
                console.log('user.token b', user.token);
                this.handleSuccessfulLogin(user);
            })
        );
    }
    handleSuccessfulLogin(user: any) {
        console.log('user', user);
        console.log('user.token', user.token);
        if (user && user.token) {


            if (user.role !== 'Player') {
                localStorage.setItem('currentUser', JSON.stringify(user));

                setTimeout(() => {
                    this._toastrService.success(
                        `You have successfully logged in as an ${user.role} user to MetaMatch. Now you can start to explore. Enjoy! 🎉`,
                        `👋 Welcome, ${user.username}!`,
                        {toastClass: 'toast ngx-toastr', closeButton: true}
                    );
                }, 2500);

            }
            this.currentUserSubject.next(user);
        }
        return user;
    }

    /**
     * User logout
     *
     */
    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        // notify
        this.currentUserSubject.next(null);
    }


    forgetPassword(email: string): Observable<any> {
        let url = `${environment.apiUrl}/api/users/forgetPassword`;
        return this._http.post(url, {email});
    }
}
