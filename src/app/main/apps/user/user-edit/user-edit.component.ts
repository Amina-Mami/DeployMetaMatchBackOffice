import {Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, NgForm} from '@angular/forms';

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {FlatpickrOptions} from 'ng2-flatpickr';
import {cloneDeep} from 'lodash';

import {UserEditService} from 'app/main/apps/user/user-edit/user-edit.service';
import {Useratribute} from "../Useratribute";
import {id} from "@swimlane/ngx-datatable";
import {UserListService} from "../user-list/user-list.service";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-user-edit',
    templateUrl: './user-edit.component.html',
    styleUrls: ['./user-edit.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class UserEditComponent implements OnInit, OnDestroy {

    userModelObject: Useratribute = new Useratribute();
    formValue !: FormGroup;
    // Public
    public url = this.router.url;
    public urlLastValue;
    public rows;
    public currentRow;
    public tempRow;
    public avatarImage: string;

    @ViewChild('accountForm') accountForm: NgForm;

    public birthDateOptions: FlatpickrOptions = {
        altInput: true
    };

    public selectMultiLanguages = ['English', 'Spanish', 'French', 'Russian', 'German', 'Arabic', 'Sanskrit'];
    public selectMultiLanguagesSelected = [];

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {Router} router
     * @param {UserEditService} _userEditService
     * @param formbuilder
     * @param _userListService
     * @param toastr
     */
    constructor(private router: Router, private _userEditService: UserEditService,
                private formbuilder: FormBuilder,
                private _userListService: UserListService,
                private toastr: ToastrService,
                ) {
        this._unsubscribeAll = new Subject();
        this.urlLastValue = this.url.substr(this.url.lastIndexOf('/') + 1);
    }

    // Public Methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Reset Form With Default Values
     */
    resetFormWithDefaultValues() {
        this.accountForm.resetForm(this.tempRow);
    }

    /**
     * Upload Image
     *
     * @param event
     */
    uploadImage(event: any) {
        if (event.target.files && event.target.files[0]) {
            let reader = new FileReader();

            reader.onload = (event: any) => {
                this.avatarImage = event.target.result;
            };

            reader.readAsDataURL(event.target.files[0]);
        }
    }

    /**
     * Submit
     *
     */
    submit() {
        {
            this.userModelObject.id = this.currentRow._id;
            this.userModelObject.fullname = this.formValue.value.fullname;
            this.userModelObject.username = this.formValue.value.username;
            this.userModelObject.email = this.formValue.value.email;
            this.userModelObject.phone = this.formValue.value.phone;
            this.userModelObject.role = this.formValue.value.role;
            this.userModelObject.height = this.formValue.value.height;
            this.userModelObject.weight = this.formValue.value.weight;
            this.userModelObject.age = this.formValue.value.age;
            this.userModelObject.nationality = this.formValue.value.nationality;
            console.log(this.userModelObject);
            this._userEditService.updateUser(this.userModelObject, this.userModelObject.id).subscribe(res => {
                    this.toastr.success(
                        'User updated successfully!',
                        '👋 Profile',
                        {toastClass: 'toast ngx-toastr', closeButton: true}
                    );

                    this.router.navigate(["apps/user/user-list"]);

                },
                error => {
                    this.toastr.error(
                        `${error}`,
                        '🚫 Erreur',
                        {toastClass: 'toast ngx-toastr', closeButton: true}
                    );

                });
        }
    }

    deleteUserDetail() {
        this._userListService.deleteUser(this.currentRow.id).subscribe(res => {
                console.log(res);

                this.router.navigate(['/apps/user/user-list'])
                alert("deleted successfully")

            },
            error => {
                console.log(error)
            }
        )
    }

    // Lifecycle Hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.formValue = this.formbuilder.group({
            fullname: [''],
            username: [''],
            email: [''],
            phone: [''],
            role: [''],
            height: [''],
            weight: [''],
            age: [''],
            nationality: ['']

        });

        this._userEditService.onUserEditChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
            this.rows = response;
            this.rows.map(row => {
                if (row._id == this.urlLastValue) {
                    this.currentRow = row;
                    this.tempRow = cloneDeep(row);

                    this.formValue.patchValue({
                        fullname: this.currentRow.fullname,
                        username: this.currentRow.username,
                        email: this.currentRow.email,
                        phone: this.currentRow.phone,
                        role: this.currentRow.role,

                        height: this.currentRow.height,
                        weight: this.currentRow.weight,
                        age: this.currentRow.age,
                        nationality: this.currentRow.nationality
                    });
                }
            });
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
