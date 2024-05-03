import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ColumnMode, DatatableComponent, id} from '@swimlane/ngx-datatable';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CoreConfigService } from '@core/services/config.service';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';

import { UserListService } from 'app/main/apps/user/user-list/user-list.service';
import {Useratribute} from "../Useratribute";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserListComponent implements OnInit {

  userModelObject: Useratribute= new Useratribute();
  // Public
  public sidebarToggleRef = false;
  public rows;
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public temp = [];
  public previousRoleFilter = '';
  public previousPlanFilter = '';
  public previousStatusFilter = '';

  public selectRole: any = [
    { name: 'All', value: '' },
    { name: 'Player', value: 'Player' },
    { name: 'Admin', value: 'Admin' },
    { name: 'Coach', value: 'Coach' },
    { name: 'Physiotherapist', value: 'Physiotherapist' },
    { name: 'Doctor', value: 'Doctor' },
  ];

  public selectStatus: any = [
    { name: 'All', value: '' },
    { name: 'Active', value: 'true' },
    { name: 'Inactive', value: 'false' }
  ];

  public selectedRole = [];
  public selectedStatus = [];

  public searchValue = '';


  // Decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;

  // Private
  private tempData = [];
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {UserListService} _userListService
   * @param {CoreSidebarService} _coreSidebarService
   * @param toastr
   */
  constructor(
    private _userListService: UserListService,
    private _coreSidebarService: CoreSidebarService,
    private _coreConfigService: CoreConfigService,
    private toastr: ToastrService,

  ) {
    this._unsubscribeAll = new Subject();
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * filterUpdate
   *
   * @param event
   */
  filterUpdate(event) {
    // Reset ng-select on search
    this.selectedRole = this.selectRole[0];

    const val = event.target.value.toLowerCase();

    // Filter Our Data
    const temp = this.tempData.filter(function (d) {
      // You need to add conditions to check the fullname, phone, and email here.
      return (d.fullname && d.fullname.toLowerCase().indexOf(val) !== -1) ||
          (d.phone && d.phone.toLowerCase().indexOf(val) !== -1) ||
          (d.email && d.email.toLowerCase().indexOf(val) !== -1) ||
          (d.username && d.username.toLowerCase().indexOf(val) !== -1) || !val;
    });

    // Update The Rows
    this.rows = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
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
   * Filter By Roles
   *
   * @param event
   */
  filterByRole(event) {
    const filter = event ? event.value : '';
    this.previousRoleFilter = filter;
    this.temp = this.filterRows(filter);
    this.rows = this.temp;
  }

  /**
   * Filter By Roles
   *
   * @param event
   */
  filterByStatus(event) {
    const filter = event ? event.value : '';
    this.previousStatusFilter = filter;
    this.temp = this.filterRowsByStatus(filter);
    this.rows = this.temp;
  }


  /**
   * Filter Rows
   *
   * @param roleFilter
   * @param statusFilter
   */
  filterRows(roleFilter,): any[] {
    // Reset search on select change
    this.searchValue = '';

    roleFilter = roleFilter.toLowerCase();


    return this.tempData.filter(row => {
      const isPartialNameMatch = row.role.toLowerCase().indexOf(roleFilter) !== -1 || !roleFilter;

      return isPartialNameMatch ;
    });
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------


  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe config change
   this.getAllData()
  }
   getAllData(){
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      //! If we have zoomIn route Transition then load datatable after 450ms(Transition will finish in 400ms)
      if (config.layout.animation === 'zoomIn') {
        setTimeout(() => {
          this._userListService.onUserListChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
            this.rows = response;
            this.tempData = this.rows;
          });
        }, 450);
      } else {
        this._userListService.onUserListChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
          this.rows = response;
          this.tempData = this.rows;
          this.userModelObject.id = this.rows.id;
        });
      }
    });

  }
  deleteUserDetail(){
    this._userListService.deleteUser(this.rows.id).subscribe(res =>{
          console.log(res);
          alert("deleted successfully")

        },
        error => {
          console.log(error)}
    )
  }




  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  toggleUserStatus(id: string) {
    this._userListService.disableOrEnableUser(id).subscribe(
        res => {
          console.log("success");
          this.toastr.success(
              'User Status Updated Successfully!',
              '👋 User Status',
              {toastClass: 'toast ngx-toastr', closeButton: true}
          );

        },
        error => {
          console.log(error);
          this.toastr.error(
              `${error}`,
              '🚫 Erreur',
              {toastClass: 'toast ngx-toastr', closeButton: true}
          );
        }
    )
  }

  filterRowsByStatus(statusFilter): any[] {
    // Reset search on select change
    this.searchValue = '';

    if (statusFilter === '') {
      return this.tempData; // If 'All' is selected, no filtering is needed
    }

    const filterValue = statusFilter === 'true'; // Convert the string to boolean

    return this.tempData.filter(row => {
      return row.status === filterValue;
    });
  }
}
