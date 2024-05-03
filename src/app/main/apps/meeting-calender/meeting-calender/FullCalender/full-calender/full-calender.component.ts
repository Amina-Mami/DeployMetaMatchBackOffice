import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import { EventInput } from '@fullcalendar/core';
import { MeetingCalenderService } from '../../Service/meeting-calender.service';

@Component({
  selector: 'app-full-calender',
  templateUrl: './full-calender.component.html',
  styleUrls: ['./full-calender.component.scss']
})
export class FullCalenderComponent implements OnInit {
  public contentHeader: object;
  meetings: any[] = [];
  showDateError: boolean = false;
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    events: [],
    editable: true
  };
  
  constructor(private backendService: MeetingCalenderService) {}

  ngOnInit() {
    this.contentHeader = {
      headerTitle: 'Players Meetings',
      actionButton: true,
      breadcrumb: {}
    };

    this.getMeetings();
  }

  getMeetings(): void {
    this.backendService.getMeetings()
      .subscribe(
        (meetings: any[]) => {
          this.meetings = meetings;
          this.calendarOptions.events = this.mapMeetingsToCalendarEvents(meetings);
        },
        (error: any) => {
          console.error('Erreur lors de la récupération des réunions:', error);
        }
      );
  }

  mapMeetingsToCalendarEvents(meetings: any[]): EventInput[] {
    return meetings.map(meeting => ({
      id: meeting.id,
      title: meeting.name,
      start: meeting.date
    }));
  }
  handleEventDrop(info: any) {
    const event = info.event;
    const eventId = event.id;
    const newDate = event.start.toISOString(); // Assurez-vous que la date est au format ISO
  
    console.log('ID de la réunion:', eventId);
    console.log('Nouvelle date:', newDate);
  
    this.backendService.updateMeetingDate(eventId, newDate)
      .subscribe(
        (updateMeeting) => {
          console.log('Réponse du backend:', updateMeeting);
          alert('Date de la réunion mise à jour avec succès.');
          // Mettez à jour les réunions dans votre frontend si nécessaire
          this.getMeetings();
        },
        (error: any) => {
          console.error('Erreur lors de la mise à jour de la date de la réunion:', error);
          alert('Erreur lors de la mise à jour de la date de la réunion.');
          // Gérer l'erreur de mise à jour ici
        }
      );
  }
}  