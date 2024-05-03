import { Component, OnInit } from '@angular/core';
import { MeetingCalenderService } from '../../Service/meeting-calender.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-players-list',
  templateUrl: './players-list.component.html',
  styleUrls: ['./players-list.component.scss']
})
export class PlayersListComponent implements OnInit {
  public contentHeader: object;
  players: any[] = [];

  constructor(private playerService: MeetingCalenderService,private router: Router) { }

  ngOnInit() {
    this.contentHeader = {
      headerTitle: 'Players List',
      actionButton: true,
      breadcrumb: {}
    };

    
    this.getPlayers();
  }

  
  getPlayers(): void {
    this.playerService.getPlayers()
      .subscribe(players => {
        this.players = players;
      });
  }
  consultMeetings(player: any): void {
    
    this.playerService.getMeetingsByPlayerId(player._id)
      .subscribe(meetings => {
     
        player.meetings = meetings;
      });
  }
  navigateToCalendar(player: any): void {
   
    this.router.navigate(['apps/meetings/calendar', player._id]);
  }
  navigateToFullCalender(): void {
   
    this.router.navigate(['apps/meetings/FullCalender']);
  }
  
  
}