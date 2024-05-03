import { Component, OnInit, OnDestroy, ViewEncapsulation } from "@angular/core";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { FlatpickrOptions } from "ng2-flatpickr";

import { AccountSettingsService } from "app/main/pages/account-settings/account-settings.service";
import { User } from "../../../auth/models";
import { UserEditService } from "../../apps/user/user-edit/user-edit.service";
import { ToastrService } from "ngx-toastr";
import * as filestack from "filestack-js";

@Component({
  selector: "app-account-settings",
  templateUrl: "./account-settings.component.html",
  styleUrls: ["./account-settings.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AccountSettingsComponent implements OnInit, OnDestroy {
  // public
  public contentHeader: object;
  public data: any;
  public birthDateOptions: FlatpickrOptions = {
    altInput: true,
  };
  public passwordTextTypeOld = false;
  public passwordTextTypeNew = false;
  public passwordTextTypeRetype = false;
  public avatarImage: string;
  isDisabled: boolean = false;
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;

  // private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {AccountSettingsService} _accountSettingsService
   * @param _userEditService
   * @param toastr
   */
  constructor(
    private _accountSettingsService: AccountSettingsService,
    private _userEditService: UserEditService,
    private toastr: ToastrService
  ) {
    this._unsubscribeAll = new Subject();
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle Password Text Type Old
   */
  togglePasswordTextTypeOld() {
    this.passwordTextTypeOld = !this.passwordTextTypeOld;
  }

  /**
   * Toggle Password Text Type New
   */
  togglePasswordTextTypeNew() {
    this.passwordTextTypeNew = !this.passwordTextTypeNew;
  }

  /**
   * Toggle Password Text Type Retype
   */
  togglePasswordTextTypeRetype() {
    this.passwordTextTypeRetype = !this.passwordTextTypeRetype;
  }

  /**
   * Upload Image
   *
   * @param event
   */
    uploadImage(event: any) {
      if (event.target.files && event.target.files[0]) {
        let reader = new FileReader();
       const client = filestack.init("A8rOsHUaWSxiCFTosYpuUz");
        this.isDisabled = true;
        client
          .upload(event.target.files[0])
          .then((response) => {
            const fileUrl = response.url;
            console.log(fileUrl);
            this.avatarImage = fileUrl;
            console.log(this.avatarImage);
            this.isDisabled = false;
          })
          .catch((error) => {
            console.error("Error:", error);
            this.isDisabled = false;
          });
      }
    }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() {
    this._accountSettingsService.onSettingsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response) => {
        this.data = response;
        console.log("current user data " + this.data.username);
        this.avatarImage = this.data.profile;
        console.log("current user data " + this.avatarImage);
      });

    // content header
    this.contentHeader = {
      headerTitle: "Account Settings",
      actionButton: true,
      breadcrumb: {
        type: "",
        links: [
          {
            name: "Home",
            isLink: true,
            link: "/",
          },
          {
            name: "Pages",
            isLink: true,
            link: "/",
          },
          {
            name: "Account Settings",
            isLink: false,
          },
        ],
      },
    };
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  resetImage() {
    this.avatarImage =
      "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png";
  }

  onSubmit() {
    const data = {
      username: this.data.username,
      fullname: this.data.fullname,
      email: this.data.email,
      profile: this.avatarImage,
    };

    console.log("account settings data", data);

    this._userEditService.updateUserCredintial(data).subscribe(
      (res) => {
        console.log("success");
        this._userEditService.updateLocalStorageField("email", this.data.email);
        this._userEditService.updateLocalStorageField(
          "username",
          this.data.username
        );
        this._userEditService.updateLocalStorageField(
          "profile",
          this.avatarImage
        );
        this.toastr.success(
          "Your profile has been updated successfully!",
          "👋 Profile",
          { toastClass: "toast ngx-toastr", closeButton: true }
        );
      },
      (error) => {
        console.log(error);
        this.toastr.error(`${error}`, "🚫 Erreur", {
          toastClass: "toast ngx-toastr",
          closeButton: true,
        });
      }
    );
  }

  onSubmitSetPassword() {
    console.log("set Password");
    console.log(this.oldPassword);
    console.log(this.newPassword);
    console.log(this.confirmNewPassword);
    if (this.newPassword != this.confirmNewPassword) {
      this.toastr.error(
        `New password and confirm password does not match!`,
        "🚫 Erreur",
        { toastClass: "toast ngx-toastr", closeButton: true }
      );
    } else {
      var userPassword = {
        oldPassword: this.oldPassword,
        newPassword: this.newPassword,
      };
      this._userEditService
        .updateUserPasswordCredintial(userPassword)
        .subscribe(
          (res) => {
            console.log("success");
            this.toastr.success(
              "Your password has been updated successfully!",
              "👋 Profile",
              { toastClass: "toast ngx-toastr", closeButton: true }
            );

            // Clear the fields after successful password change
            this.oldPassword = "";
            this.newPassword = "";
            this.confirmNewPassword = "";
          },
          (error) => {
            console.log(error.error.message);
            this.toastr.error(`${error.error.message}`, "🚫 Erreur", {
              toastClass: "toast ngx-toastr",
              closeButton: true,
            });
          }
        );
    }
  }
}
