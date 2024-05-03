import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MeetingCalenderService } from './Service/meeting-calender.service';
import { Meeting } from './meeting-calender'; 
import * as moment from 'moment';

@Component({
  selector: 'app-meeting-calender',
  templateUrl: './meeting-calender.component.html',
  styleUrls: ['./meeting-calender.component.scss']
})
export class MeetingCalenderComponent implements OnInit {
  meetings: Meeting[] = [];
  playerId: string = '';

  constructor(private meetingService: MeetingCalenderService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.playerId = this.route.snapshot.paramMap.get('playerId');
    this.getMeetings();
  }

  getMeetings(): void {
    this.meetingService.getMeetingsByPlayerId(this.playerId)
      .subscribe(
        meetings => {
          this.meetings = meetings;


        },
        error => {
          console.error('Erreur lors de la récupération des réunions :', error);
        }
      );
  }
  formatDate(dateString: string): string {
    const formattedDate = moment.utc(dateString).format('DD/MM/YYYY');
    return formattedDate !== 'Invalid date' ? formattedDate : 'Invalid Date';
  }
  
  
  cancelMeeting(meetingId: string): void {
    this.meetingService.cancelMeeting(meetingId).subscribe(() => {
      this.getMeetings();
    }, error => {
      console.error('Erreur lors de l\'annulation de la réunion:', error);
      alert('Erreur lors de l\'annulation de la réunion. Veuillez réessayer.');
    });
  }
  
}  