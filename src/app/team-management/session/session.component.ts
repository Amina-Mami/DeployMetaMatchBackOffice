import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Session } from "./session.model";
import { TeamService } from "../team.service";

import { CalendarOptions, EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
//import { cl } from "@fullcalendar/core/internal-common";
import { DatePipe } from "@angular/common";
import interactionPlugin from "@fullcalendar/interaction";

@Component({
  selector: "app-session",
  templateUrl: "./session.component.html",
  styleUrls: ["./session.component.scss"],
})
export class SessionComponent implements OnInit {
  sessions: Session[] = [];
  sessionsPerWeek: { [key: string]: number } = {};
  sessionsPerMonthWeek: any;
  sessionsPerMonth: number | undefined;
  sessionDistributionChart: any;

  selectedMonth: number;
  months = [
    { name: "January", value: 1 },
    { name: "February", value: 2 },
    { name: "March", value: 3 },
    { name: "April", value: 4 },
    { name: "May", value: 5 },
    { name: "June", value: 6 },
    { name: "July", value: 7 },
    { name: "August", value: 8 },
    { name: "September", value: 9 },
    { name: "October", value: 10 },
    { name: "November", value: 11 },
    { name: "December", value: 12 },
  ];
  events: EventInput[] = [];

  sessionForm: FormGroup;
  editSessionForm: FormGroup;
  showEditModal: boolean = false;
  showAddModal: boolean = false;
  showSuccessAlert: boolean = false;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: "dayGridMonth",
    events: [],
    eventClick: this.handleEventClick.bind(this),
    eventDrop: this.handleEventDrop.bind(this),
    eventBackgroundColor: "#FF5733",
    editable: true,
  };

  constructor(
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private teamService: TeamService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    // this.session = {};
  }

  ngOnInit() {
    this.sessionForm = this.formBuilder.group({
      _id: [null],

      date: ["", [Validators.required]],
      time: ["", [Validators.required]],
      location: ["", [Validators.required, Validators.minLength(3)]],
      topics: [
        "",
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.minLength(3),
        ],
      ],
    });

    this.editSessionForm = this.formBuilder.group({
      _id: [null],
      date: ["", Validators.required],
      time: ["", Validators.required],
      location: ["", [Validators.required, Validators.minLength(3)]],
      topics: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
    });

    this.fetchSessions();
    this.selectedMonth = new Date().getMonth() + 1;
    const currentMonth = new Date().getMonth() + 1;
  }

  fetchSessions(): void {
    this.teamService.getAllSessions().subscribe(
      (response: any) => {
        if (response && Array.isArray(response.sessions)) {
          const sessions = response.sessions;
          console.log("Sessions:", sessions);

          this.sessions = sessions;
          this.events = sessions.map((session: any) =>
            this.formatSessionForCalendar(session)
          );
          this.calendarOptions.events = this.events;
        } else {
          console.error("Invalid sessions data:", response);
        }

        // Handle sessionsPerWeek data
        if (response.sessionsPerWeek) {
          this.sessionsPerWeek = response.sessionsPerWeek;
          console.log("Sessions per week:", this.sessionsPerWeek);
        }
      },
      (error: any) => {
        console.error("Error fetching sessions:", error);
      }
    );
  }

  onMonthSelect(): void {
    // Fetch sessions for the selected month
    this.fetchSessionsForMonth(this.selectedMonth);
  }

  fetchSessionsForMonth(month: number): void {
    this.teamService.getAllSessionsForMonth(month).subscribe(
      (response: any) => {
        // Handle the response data
        console.log("Sessions for month:", response);
        this.hideSessionsPerMonth();
        if (response && response.sessionsPerMonth !== undefined) {
          this.sessionsPerMonth = response.sessionsPerMonth;
        } else {
          // Handle the case where sessions are not available
          console.error("Invalid sessions data:", response);
        }
      },
      (error: any) => {
        console.error("Error fetching sessions for month:", error);
        // Handle errors
      }
    );
  }

  hideSessionsPerMonth(): void {
    setTimeout(() => {
      this.sessionsPerMonth = undefined;
    }, 1000);
  }

  handleEventDrop(info: any) {
    const event = info.event;

    const eventId = event.id;
    const newStartDate = event.start;
    const newEndDate = event.end;

    this.teamService
      .updateSession(eventId, { date: newStartDate, time: newEndDate })
      .subscribe(
        (updatedSession) => {
          console.log(
            "Event updated successfully in the backend:",
            updatedSession
          );
          alert("the session is updated successfully");
          this.fetchSessions();
        },
        (error) => {
          if (error.error.message === "Conflict") {
            alert("A session  is already scheduled on the same date");
            this.fetchSessions();
          } else {
            console.error("Error updating session:", error);
          }
        }
      );
  }

  handleEventClick(clickInfo: any) {
    const event = clickInfo.event;
    console.log("Clicked Event:", event);
    console.log("Event Object:", event);

    const session: Session = {
      _id: event.id,
      date: event.start,
      time: event.extendedProps.time,
      location: event.extendedProps.location,
      topics: event.extendedProps.topics.split(","),
    };
    this.openEditModal(session);
  }

  openEditModal(session: Session) {
    console.log("here are the selected items", session);
    console.log("_id in openEditModal:", session._id);

    this.showEditModal = true;
    this.editSessionForm.patchValue({
      _id: session._id, // Ensure session._id is correctly assigned here
      date: this.datePipe.transform(session.date, "yyyy-MM-dd"),
      time: session.time ? session.time.toString() : "",
      location: session.location,
      topics: session.topics.join(","),
    });
  }

  closeEditModal() {
    this.showEditModal = false;
  }

  openAddModal() {
    this.sessionForm.reset();
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
  }

  closeModal() {
    this.showEditModal = false;
    this.showAddModal = false;
  }

  formatSessionForCalendar(session: Session): EventInput {
    return {
      title: "Training",
      id: session._id,
      date: session.date,
      time: session.time,
      location: session.location,
      topics: session.topics.join(","),
    };
  }

  addSession(): void {
    if (this.sessionForm.invalid) {
      return;
    }

    const sessionData: Session = this.sessionForm.value;
    this.teamService.addSession(sessionData).subscribe(
      (newSession) => {
        this.sessions.push(newSession);
        console.log("Session added successfully:", newSession);
        this.sessionForm.reset();
        const newEvent = this.formatSessionForCalendar(newSession);
        this.events.push(newEvent);
        this.calendarOptions.events = this.events;
        this.showSuccessAlert = true;
        this.changeDetectorRef.detectChanges();
        setTimeout(() => {
          this.showSuccessAlert = false;
        }, 3000);
        setTimeout(() => {
          this.closeAddModal();
        }, 2000);

        this.fetchSessions();
      },
      (error) => {
        console.error("Error adding session:", error);
        if (
          error &&
          error.error &&
          error.error.error ===
            "Conflict: A session already exists at this date ."
        )
          this.closeModal();
        {
          alert("A session already exists at this date and time.");
        }
      }
    );
  }

  deleteSession(): void {
    if (!this.editSessionForm.value._id) {
      console.error("No session selected for deletion.");
      return;
    }

    const sessionId: string = this.editSessionForm.value._id;

    const confirmDelete = confirm(
      "Are you sure you want to delete this session?"
    );
    if (!confirmDelete) {
      this.showEditModal = false;
      return;
    }

    this.teamService.deleteSession(sessionId).subscribe(
      () => {
        const index = this.sessions.findIndex(
          (session) => session._id === sessionId
        );
        if (index !== -1) {
          this.sessions.splice(index, 1);
          const eventIndex = this.events.findIndex(
            (event) => event.id === sessionId
          );
          if (eventIndex !== -1) {
            this.events.splice(eventIndex, 1);
            this.calendarOptions.events = this.events;
          }
        } else {
          console.error("Session not found in sessions array:", sessionId);
        }
        console.log("Session deleted successfully:", sessionId);
        alert("Session deleted successfully");
        this.showEditModal = false;
        this.fetchSessions();
      },
      (error) => {
        console.error("Error deleting session:", error);
      }
    );
  }

  // editSession(): void {
  //   const sessionData: Session = this.editSessionForm.value;
  //   const _id: string = sessionData._id;

  //   const sessionToUpdate: Session = { ...sessionData };
  //   delete sessionToUpdate._id;

  //   this.teamService.getSessionById(_id).subscribe(
  //     (existingSession: Session) => {
  //       if (existingSession.date !== sessionData.date) {
  //         this.updateSession(_id, sessionToUpdate);
  //       } else {
  //         this.teamService.getAllSessions().subscribe(
  //           (response: any) => {
  //             if (response && Array.isArray(response.sessions)) {
  //               const sessions = response.sessions;
  //               const conflictingSession = sessions.find(
  //                 (session: Session) =>
  //                   session.date === sessionData.date && session._id !== _id
  //               );
  //               this.updateSession(_id, sessionToUpdate);

  //               if (conflictingSession) {
  //                 alert("A session already exists at this date and time.");
  //               } else {
  //                 this.updateSession(_id, sessionToUpdate);
  //               }
  //             } else {
  //               console.error("Invalid sessions data:", response);
  //             }
  //           },
  //           (error: any) => {
  //             console.error("Error fetching sessions:", error);
  //           }
  //         );
  //       }
  //     },
  //     (error) => {
  //       console.error("Error retrieving session:", error);
  //     }
  //   );
  // }

  editSession(): void {
    const sessionData: Session = this.editSessionForm.value;
    console.log(sessionData);
    const _id: string = sessionData._id;
    console.log(_id);
    if (!_id) {
      console.error("Session ID is undefined.");
      return;
    }

    const sessionToUpdate: Session = { ...sessionData };
    delete sessionToUpdate._id;

    this.updateSession(_id, sessionToUpdate);
  }

  updateSession(_id: string, sessionToUpdate: Session): void {
    this.teamService.updateSession(_id, sessionToUpdate).subscribe(
      (updatedSession) => {
        const index = this.sessions.findIndex((session) => session._id === _id);
        if (index !== -1) {
          this.sessions[index] = updatedSession;
          const eventIndex = this.events.findIndex((event) => event.id === _id);
          if (eventIndex !== -1) {
            this.events[eventIndex] =
              this.formatSessionForCalendar(updatedSession);
            this.calendarOptions.events = this.events;
          }
        } else {
          console.error("Session not found in sessions array:", _id);
        }
        alert("Session updated successfully");
        this.showEditModal = false;
        this.fetchSessions();
        console.log("Session updated successfully:", updatedSession);
      },
      (error) => {
        if (error.status === 400 && error.error.message === "Conflict") {
          alert("A session already exists at this date and time.");
        } else {
          console.error("Error updating session:", error);
        }
      }
    );
  }
}
