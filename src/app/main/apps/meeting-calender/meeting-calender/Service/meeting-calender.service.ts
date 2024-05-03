import { Injectable } from '@angular/core';
import { Meeting } from '../meeting-calender';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MeetingCalenderService {
  private baseUrl = 'http://localhost:3000/api'; 
  constructor(private http: HttpClient) { }

  getPhysiotherapists(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/physiotherapists`);
  }
  getPlayers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/players`);
  }

  getMeetings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/meetings`);
  }
  scheduleMeeting(meetingData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/schedule-meeting`, meetingData);
  }
  cancelMeeting(meetingId: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/cancel-meeting/${meetingId}`);
  }
  updateMeeting(meetingId: string, meetingData: Meeting): Observable<Meeting> {
    return this.http.put<Meeting>(`${this.baseUrl}/update-meeting/${meetingId}`, meetingData);
  }
  getMeetingsByPlayerId(playerId: string): Observable<Meeting[]> {
    return this.http.get<Meeting[]>(`${this.baseUrl}/meetings/player/${playerId}`);
  }
  updateMeetingDate(meetingId: string, newDate: Date): Observable<any> {
    const url = `${this.baseUrl}/matches/${meetingId}`;
    return this.http.put<any>(url, { meetingDate: newDate });
  }
}
