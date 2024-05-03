import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { Session } from "./session/session.model";
import { Match } from "./match/match.model";
import { Forum } from "./forum/forum.model";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class TeamService {
  private apiUrl = "http://localhost:3000";

  constructor(private http: HttpClient) {}

  getAllSessions(): Observable<Session[]> {
    return this.http.get<Session[]>(`${this.apiUrl}/sessions`);
  }
  getSessionById(sessionId: string): Observable<Session> {
    return this.http.get<Session>(`${this.apiUrl}/sessions/${sessionId}`);
  }
  getMatchById(matchId: string): Observable<Match> {
    return this.http.get<Match>(`${this.apiUrl}/matches/${matchId}`);
  }

  addSession(sessionData: Session): Observable<Session> {
    return this.http.post<Session>(`${this.apiUrl}/sessions`, sessionData);
  }

  updateSession(sessionId: string, sessionData: Session): Observable<Session> {
    return this.http.put<Session>(
      `${this.apiUrl}/sessions/${sessionId}`,
      sessionData
    );
  }

  updateMatch(matchId: string, matchData: Match): Observable<Match> {
    return this.http.put<Match>(`${this.apiUrl}/matches/${matchId}`, matchData);
  }

  getAllSessionsForMonth(month: number): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/sessions/sessions-by-month?month=${month}`
    );
  }

  getAllSessionsStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sessions/stats`);
  }

  deleteSession(sessionId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/sessions/${sessionId}`);
  }

  getAllMatches(): Observable<Match[]> {
    return this.http.get<Match[]>(`${this.apiUrl}/matches`);
  }

  addMatch(matchData: Match): Observable<Match> {
    return this.http.post<Match>(`${this.apiUrl}/matches`, matchData);
  }

  // updateMatch(matchId: string, matchData: Match): Observable<Match> {
  //   return this.http.put<Match>(`${this.apiUrl}/matches/${matchId}`, matchData);
  // }

  deleteMatch(matchId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/matches/${matchId}`);
  }

  uploadCsv(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/matches/upload-csv`, formData);
  }

  scrapeMatches(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/matches/matches`);
  }

  getAllForums(): Observable<Session[]> {
    return this.http.get<Session[]>(`${this.apiUrl}/forum`);
  }

  addForum(forumData: Forum): Observable<Forum> {
    return this.http.post<Forum>(`${this.apiUrl}/forum`, forumData);
  }

  updateForum(forumId: string, forumData: Forum): Observable<Forum> {
    return this.http.put<Forum>(`${this.apiUrl}/forum/${forumId}`, forumData);
  }

  deleteForum(forumId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/forum/${forumId}`);
  }
  getMatchDistribution(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/matches/match-distribution`);
  }
}
