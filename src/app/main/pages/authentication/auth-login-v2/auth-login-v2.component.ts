import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {takeUntil, first} from 'rxjs/operators';
import {Subject} from 'rxjs';

declare var google: any;
import {AuthenticationService} from 'app/auth/service';
import {CoreConfigService} from '@core/services/config.service';
import {ToastrService} from "ngx-toastr";
import {NgZone} from '@angular/core';
import { SocialAuthService } from 'angularx-social-login';

@Component({
    selector: 'app-auth-login-v2',
    templateUrl: './auth-login-v2.component.html',
    styleUrls: ['./auth-login-v2.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AuthLoginV2Component implements OnInit {
    //  Public
    public coreConfig: any;
    public loginForm: FormGroup;
    public loading = false;
    public submitted = false;
    public returnUrl: string;
    public error = '';
    public passwordTextType: boolean;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {CoreConfigService} _coreConfigService
     * @param _formBuilder
     * @param _route
     * @param _router
     * @param _authenticationService
     * @param toastr
     * @param authService
     */
    constructor(
        private _coreConfigService: CoreConfigService,
        private _formBuilder: FormBuilder,
        private _route: ActivatedRoute,
        private _router: Router,
        private _authenticationService: AuthenticationService,
        private toastr: ToastrService,
        private authService: SocialAuthService,
        private ngZone: NgZone,
    ) {
        // redirect to home if already logged in
        if (this._authenticationService.currentUserValue) {
            this._router.navigate(['/']);
        }

        this._unsubscribeAll = new Subject();

        // Configure the layout
        this._coreConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                menu: {
                    hidden: true
                },
                footer: {
                    hidden: true
                },
                customizer: false,
                enableLocalStorage: false
            }
        };
    }

    ngAfterViewInit(): void {
        console.log(document.getElementById('google_btn'))
        setTimeout(() => {
            google.accounts.id.initialize({
                client_id: '7217142055-a5v88qjgt7fl8ejabirqtvduk3o6pmhb.apps.googleusercontent.com',
                callback: (resp: any) => {
                    this.handleLogin(resp)
                },

            });
            google.accounts.id.renderButton(document.getElementById('google_btn'), {
                theme: 'filled_blue',
                size: 'large',
                shape: 'rectangle',
                width: 350,
                click_listener: this.onClickHandler
            });
        }, 1)

    }

    onClickHandler() {
        console.log("Sign in with Google button clicked...")
    }

    handleLogin(response: any) {
        if (response && response.credential) {
            this.loading = true; // Indicate loading start

            this._authenticationService.verifyGoogleToken(response.credential)
                .pipe(first())
                .subscribe(
                    data => {
                        console.log("data user role", data.role);
                        if (data.role !== 'Player') {
                            this.ngZone.run(() => {
                                this._authenticationService.handleSuccessfulLogin(data);
                                this.loading = false;
                                this._router.navigate([this.returnUrl]);
                            })
                        } else {
                            this.ngZone.run(() => {
                                this.error = 'Access Denied. Players are not allowed to log in.';
                                this.loading = false;
                            });
                        }

                    },
                    error => {
                        // Handle error
                        this.ngZone.run(() => {
                            // Display error toast
                            this.toastr.error(error.error.message, 'Login failed', {
                                positionClass: 'toast-top-center',
                                timeOut: 5000,
                            });
                            this.error = error.error.message || 'An unexpected error occurred.';
                            this.loading = false; // Stop loading on error
                        });
                    }
                );
        }
    }

    decodeToken(token: string) {
        return JSON.parse(atob(token.split(".")[1]))
    }


    // convenience getter for easy access to form fields
    get f() {
        return this.loginForm.controls;
    }

    /**
     * Toggle password
     */
    togglePasswordTextType() {
        this.passwordTextType = !this.passwordTextType;
    }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        // Login
        this.loading = true;
        this._authenticationService
            .login(this.f.email.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                data => {
                    console.log("data user role", data.role);
                    if (data.role === 'Player') {
                        this.error = 'Access Denied. Players are not allowed to log in.';
                        this.loading = false;
                    } else {
                        this._router.navigate([this.returnUrl]);
                    }
                },
                error => {
                    if (error && error.error && error.error.message) {
                        this.error = error.error.message;
                    } else {
                        this.error = 'An unexpected error occurred.';
                    }
                    this.loading = false;
                }
            );
    }

    // Lifecycle Hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.loginForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';

        // Subscribe to config changes
        this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
            this.coreConfig = config;
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

}
