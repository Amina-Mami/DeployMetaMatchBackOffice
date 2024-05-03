import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ComponentFactoryResolver,
  ViewContainerRef,
  Injector,
} from "@angular/core";

import { ViewChild, ElementRef, NgZone } from "@angular/core";

import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Match } from "./match.model";
import { TeamService } from "../team.service";

import { CalendarOptions, EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
//import { cl } from "@fullcalendar/core/internal-common";
import { DatePipe } from "@angular/common";
import interactionPlugin from "@fullcalendar/interaction";
import { EventTooltipComponent } from "../event-tooltip/event-tooltip.component";
import * as pdfjsLib from "pdfjs-dist";
import { Observable } from "rxjs";
import { forkJoin } from "rxjs";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { WebSocketService } from "../web-socket.service";

@Component({
  selector: "app-match",
  templateUrl: "./match.component.html",
  styleUrls: ["./match.component.scss"],
})
export class MatchComponent implements OnInit {
  matches: Match[] = [];
  matchForm: FormGroup;
  editMatchForm: FormGroup;
  showEditModal: boolean = false;
  showAddModal: boolean = false;
  showSuccessAlert: boolean = false;
  matchId: string;
  newDate: Date;
  currentScore: number = 0;
  events: EventInput[] = [];
  // gameFinished: boolean = false;
  score: number = 0;

  teamAScore: number = 0;
  teamBScore: number = 0;
  gameFinished: boolean = false;

  teamAName: string = "";
  teamBName: string = "";

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: "dayGridMonth",
    events: [],
    eventClick: this.handleEventClick.bind(this),
    eventDrop: this.handleEventDrop.bind(this),
    eventMouseEnter: this.handleEventMouseEnter.bind(this),
    eventMouseLeave: this.handleEventMouseLeave.bind(this),
    eventBackgroundColor: "#FF5733",
    editable: true,
  };
  hoveredEvent: Match | null = null;
  tooltipVisible: boolean = false;
  tooltipPosition: { top: number; left: number } = { top: 0, left: 0 };
  @ViewChild("modal") modal: NgbModal;
  constructor(
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private teamService: TeamService,
    private webSocketService: WebSocketService,
    private changeDetectorRef: ChangeDetectorRef,
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private viewContainerRef: ViewContainerRef,
    private ngZone: NgZone,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.matchForm = this.formBuilder.group({
      _id: [null],
      date: ["", Validators.required],
      time: ["", Validators.required],
      location: ["", [Validators.required, Validators.minLength(3)]],
      teamA: ["", [Validators.required, Validators.minLength(3)]],
      teamB: ["", [Validators.required, Validators.minLength(3)]],
    });

    this.editMatchForm = this.formBuilder.group({
      _id: [null],
      date: ["", Validators.required],
      time: ["", Validators.required],
      location: ["", [Validators.required, Validators.minLength(3)]],
      teamA: ["", [Validators.required, Validators.minLength(3)]],
      teamB: ["", [Validators.required, Validators.minLength(3)]],
    });

    this.fetchMatches();
    this.calendarOptions.events = this.events;
    this.changeDetectorRef.detectChanges();
  }

  fetchMatches(): void {
    this.teamService.getAllMatches().subscribe(
      (matches) => {
        console.log("Matches:", matches);
        this.matches = matches;
        this.events = matches.map((match) => ({
          id: match._id,
          start: match.date,
          time: match.time,
          location: match.location,
          teamA: match.teamA,
          teamB: match.teamB,
          title: `${match.teamA} vs ${match.teamB}`,
        }));
        this.calendarOptions.events = this.events;
      },
      (error) => {
        console.error("Error fetching matches:", error);
      }
    );
  }

  handleEventDrop(info: any) {
    const event = info.event;

    const eventId = event.id;
    const newStartDate = event.start;
    const newEndDate = event.end;

    this.teamService
      .updateMatch(eventId, { date: newStartDate, time: newEndDate })
      .subscribe(
        (updatedMatch) => {
          alert("the session is updated successfully");
          this.fetchMatches;
          console.log(
            "Event updated successfully in the backend:",
            updatedMatch
          );
        },
        (error) => {
          if (error.error.message === "Conflict") {
            alert("A match is already scheduled on the same date");
            this.fetchMatches();
          } else {
            console.error("Error updating match:", error);
          }
        }
      );
  }

  handleEventClick(clickInfo: any) {
    const event = clickInfo.event;

    console.log("Clicked Event:", event.id);
    console.log("Event Object:", event.start);

    const match: Match = {
      _id: event.id,
      date: event.start,
      time: event.extendedProps.time,
      location: event.extendedProps.location,
      teamA: event.extendedProps.teamA,
      teamB: event.extendedProps.teamB,
    };
    this.openEditModal(match);
  }

  openEditModal(match: Match) {
    const formattedDate = this.datePipe.transform(match.date, "yyyy-MM-dd");

    this.editMatchForm.patchValue({
      _id: match._id,
      date: formattedDate,
      time: match.time ? match.time.toString() : "",
      location: match.location,
      teamA: match.teamA,
      teamB: match.teamB,
    });

    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
  }

  openAddModal() {
    this.matchForm.reset();
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
  }

  closeModal() {
    this.showEditModal = false;
    this.showAddModal = false;
  }

  addMatch(): void {
    if (this.matchForm.invalid) {
      return;
    }

    const matchData: Match = this.matchForm.value;

    this.teamService.addMatch(matchData).subscribe(
      (newMatch) => {
        this.matches.push(newMatch);
        console.log("Match added successfully:", newMatch);
        this.matchForm.reset();
        this.fetchMatches();
        const newEvent = this.formatMatchForCalendar(newMatch);
        this.events.push(newEvent);
        this.calendarOptions.events = this.events;
        this.showSuccessAlert = true;
        this.changeDetectorRef.detectChanges();

        setTimeout(() => {
          this.showSuccessAlert = false;
          this.closeAddModal();
        }, 3000);
      },
      (error) => {
        if (
          error.status === 400 &&
          error.error.message ===
            "A match is already scheduled on the same date"
        ) {
          alert("A match is already scheduled on the same date");
        } else {
          console.error("Error adding match:", error);
        }
      }
    );
  }

  deleteMatch(): void {
    if (!this.editMatchForm.value._id) {
      console.error("No match selected for deletion.");
      return;
    }

    const matchId: string = this.editMatchForm.value._id;

    const confirmDelete = confirm(
      "Are you sure you want to delete this match?"
    );
    if (!confirmDelete) {
      this.showEditModal = false;
      return;
    }

    this.teamService.deleteMatch(matchId).subscribe(
      () => {
        const index = this.matches.findIndex((match) => match._id === matchId);
        if (index !== -1) {
          this.matches.splice(index, 1);
          const eventIndex = this.events.findIndex(
            (event) => event.id === matchId
          );
          if (eventIndex !== -1) {
            this.events.splice(eventIndex, 1);
            this.calendarOptions.events = this.events;
          }
        } else {
          console.error("Match not found in Matches array:", matchId);
        }
        console.log("Match deleted successfully:", matchId);
        alert("Match deleted successfully");
        this.showEditModal = false;
        this.fetchMatches();
      },
      (error) => {
        console.error("Error deleting match:", error);
      }
    );
  }

  editMatch(): void {
    if (this.editMatchForm.invalid) {
      return;
    }

    const matchData: Match = this.editMatchForm.value;
    const matchId = matchData._id;

    this.teamService.updateMatch(matchId, matchData).subscribe(
      (updatedMatch) => {
        console.log("Match updated successfully:", updatedMatch);
        this.closeEditModal();
        this.fetchMatches();

        alert("Match updated successfully!");
        this.closeEditModal();
      },
      (error) => {
        if (error.status === 400 && error.error.message === "Conflict") {
          alert(
            "A match is already scheduled on the same date. Please choose another date or time."
          );
        } else {
          console.error("Error updating match:", error);
        }
      }
    );
  }

  formatMatchForCalendar(match: Match): EventInput {
    const teamA = match.teamA;
    const teamB = match.teamB;

    return {
      title: `${match.teamA} vs ${match.teamB}`,

      start: match.date,
    };
  }

  handleEventMouseEnter(info: any) {
    const rect = info.el.getBoundingClientRect();
    const tooltipHeight = 200;
    const offset = tooltipHeight + 10;
    this.tooltipPosition = {
      top: rect.top + window.scrollY - offset,
      left: rect.left + window.scrollX,
    };
    const matchId = info.event.id;
    this.hoveredEvent = this.matches.find((match) => match._id === matchId);
    this.tooltipVisible = true;
  }

  handleEventMouseLeave() {
    this.hoveredEvent = null;
    this.tooltipVisible = false;
  }

  handleCsvSelection(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.uploadCsv(file);
    }
  }

  uploadCsv(file: File) {
    const formData = new FormData();
    formData.append("csvFile", file);

    this.teamService.uploadCsv(formData).subscribe(
      (response) => {
        console.log("CSV file uploaded successfully:", response);
        alert("CSV file uploaded successfully.");

        this.fetchMatches();
      },
      (error) => {
        console.error("Error uploading CSV file:", error);
        alert("Error uploading CSV file. Please try again.");
      }
    );
  }

  finishGame() {
    this.gameFinished = true;

    this.webSocketService.sendMessage({ type: "finish_game" });
  }

  incrementTeamAScore(teamName: string) {
    this.teamAScore++;

    this.webSocketService.sendMessage({
      type: "update_scores",
      teamA: this.teamAScore,
      teamB: this.teamBScore,
      teamAName: teamName,
      teamBName: this.teamBName,
    });
  }

  restartGame() {
    this.teamAName = "";
    this.teamBName = "";
    this.teamAScore = 0;
    this.teamBScore = 0;
    this.gameFinished = false;
    this.webSocketService.sendMessage({ type: "restart" });
  }

  decrementTeamAScore(teamName: string) {
    if (this.teamAScore > 0) {
      this.teamAScore--;
    }

    this.webSocketService.sendMessage({
      type: "update_scores",
      teamA: this.teamAScore,
      teamB: this.teamBScore,
      teamAName: teamName,
      teamBName: this.teamBName,
    });
  }

  incrementTeamBScore(teamName: string) {
    this.teamBScore++;

    this.webSocketService.sendMessage({
      type: "update_scores",
      teamA: this.teamAScore,
      teamB: this.teamBScore,
      teamAName: this.teamAName,
      teamBName: teamName,
    });
  }

  decrementTeamBScore(teamName: string) {
    if (this.teamBScore > 0) {
      this.teamBScore--;
    }

    this.webSocketService.sendMessage({
      type: "update_scores",
      teamA: this.teamAScore,
      teamB: this.teamBScore,
      teamAName: this.teamAName,
      teamBName: this.teamBName,
    });
  }
}
