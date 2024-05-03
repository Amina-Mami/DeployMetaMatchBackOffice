import {Component, OnInit} from '@angular/core';
import {CoreSidebarService} from '@core/components/core-sidebar/core-sidebar.service';
import {Useratribute} from "../../Useratribute";
import {FormBuilder, FormGroup} from "@angular/forms";
import {UserListService} from "../user-list.service";
import {UserListComponent} from "../user-list.component";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-new-user-sidebar',
    templateUrl: './new-user-sidebar.component.html'
})
export class NewUserSidebarComponent implements OnInit {

    userModelObject: Useratribute = new Useratribute();
    formValue !: FormGroup;
    getAllData: UserListComponent;


    /**
     * Constructor
     *
     * @param userListService
     * @param {FormBuilder} formbuilder
     * @param {CoreSidebarService} _coreSidebarService
     * @param toastr
     */
    constructor(
        private userListService: UserListService,
        private formbuilder: FormBuilder,
        private _coreSidebarService: CoreSidebarService,
        private toastr: ToastrService) {
    }

    /**
     * Toggle the sidebar
     *
     * @param name
     */
    toggleSidebar(name): void {
        this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
    }


    /**
     * Submit
     *
     * @param form
     */
    submit(form) {
        if (form.valid) {

            this.toggleSidebar('new-user-sidebar');
        }
    }


    ngOnInit(): void {

        this.formValue = this.formbuilder.group({
            fullname: [''],
            username: [''],
            email: [''],
            phone: [''],
            salary: [''],
            role: [''],
            // Adding the new fields
            height: [''],
            weight: [''],
            age: [''],
            nationality: ['']
        })


    }


    addUserDetails() {

        this.userModelObject = {...this.formValue.value};

        this.userListService.addUser(this.userModelObject)
            .subscribe(res => {
                    console.log(res);
                    this.toastr.success(
                        'User added successfully!',
                        '👋 Profile',
                        {toastClass: 'toast ngx-toastr', closeButton: true}
                    );

                    this.formValue.reset();
                    this.toggleSidebar('new-user-sidebar');

                },
                error => {
                    console.log(error.error.message);
                    this.toastr.error(
                        `${error.error.message}`,
                        '🚫 Erreur',
                        {toastClass: 'toast ngx-toastr', closeButton: true}
                    );

                });
    }


}
