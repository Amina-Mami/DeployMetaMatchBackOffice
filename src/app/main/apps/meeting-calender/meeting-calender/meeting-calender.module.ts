import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeetingCalenderComponent } from './meeting-calender.component';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { FullCalendarModule } from '@fullcalendar/angular';
import { PlayersListComponent } from './playersList/players-list/players-list.component';
import { FullCalenderComponent } from './FullCalender/full-calender/full-calender.component';

const routes: Routes = [
  {
    path: 'calendar/:playerId',
    component: MeetingCalenderComponent
  }, {
    path: 'playerslist',
    component: PlayersListComponent
  },
  {
    path:"FullCalender",
    component:FullCalenderComponent
  }
];

@NgModule({
  declarations: [MeetingCalenderComponent, PlayersListComponent, FullCalenderComponent],
  imports: [RouterModule.forChild(routes), NgbModule, ContentHeaderModule, FullCalendarModule, CommonModule
  
  ]
})
export class MeetingCalenderModule { }
