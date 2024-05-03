import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

import {CoreConfigService} from '@core/services/config.service';
import {ToastrService} from "ngx-toastr";
import {AuthenticationService} from "../../../../auth/service";

@Component({
    selector: 'app-auth-forgot-password-v2',
    templateUrl: './auth-forgot-password-v2.component.html',
    styleUrls: ['./auth-forgot-password-v2.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AuthForgotPasswordV2Component implements OnInit {
    // Public
    public emailVar;
    public coreConfig: any;
    public forgotPasswordForm: FormGroup;
    public submitted = false;
    public responseMessage: string | null = null;
    public alertType: 'success' | 'danger' = 'success';
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {CoreConfigService} _coreConfigService
     * @param {FormBuilder} _formBuilder
     *
     * @param _authenticationService
     * @param toastr
     */
    constructor(private _coreConfigService: CoreConfigService,
                private _formBuilder: FormBuilder,
                private _authenticationService: AuthenticationService,
                private toastr: ToastrService) {
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

    // convenience getter for easy access to form fields
    get f() {
        return this.forgotPasswordForm.controls;
    }

    /**
     * On Submit
     */

    onSubmit() {
        this.submitted = true;
        this.responseMessage = null; // Reset the message on new submission

        if (this.forgotPasswordForm.valid) {
            this._authenticationService.forgetPassword(this.forgotPasswordForm.value.email)
                .subscribe({
                    next: (response) => {
                        // Check if the response has a status property that indicates success or failure
                        if (response.status) {
                            this.alertType = 'success';
                        } else {
                            this.alertType = 'danger';
                        }
                        this.responseMessage = response.message;
                    },
                    error: (error) => {
                        // Assume any server error falls into the 'danger' category
                        this.alertType = 'danger';
                        this.responseMessage = 'Something went wrong!';
                    }
                });
        }
    }    // Lifecycle Hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.forgotPasswordForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });

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
