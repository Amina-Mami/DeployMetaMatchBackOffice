import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Form } from "./model/Form";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PerformanceServiceService {
  constructor(private http: HttpClient) {}

  private apiUrl = "http://localhost:5000";
  private jsonUrl = "assets/player.json";
  private apiUrl1 = "http://localhost:3001/api/form";
  private apiUrl2 = "http://localhost:3001/users";

  getPassesChart(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/get_passes_chart`, {
      responseType: "blob",
    });
  }

  getPassesVideo(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/get_video`, { responseType: "blob" });
  }

  getPassesData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get_passes_data`);
  }

  getData() {
    return this.http.get<any>(`${this.apiUrl}/get_passes_data_json`);
  }

  getJoueurs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl2}/getPlayer`);
  }

  addForm(formData: Form): Observable<Form> {
    return this.http.post<Form>(`${this.apiUrl1}/add`, formData);
  }

  getForms(): Observable<Form[]> {
    return this.http.get<Form[]>(`${this.apiUrl1}/get`);
  }
  deleteForm(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl1}/delete/${id}`);
  }

  updateForm(formData: Form): Observable<any> {
    return this.http.put(`${this.apiUrl1}/update/${formData._id}`, formData);
  }

  getFormById(formId: string): Observable<Form> {
    return this.http.get<Form>(`${this.apiUrl1}/${formId}`);
  }

  getPlayerStatistics(playerId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl1}/${playerId}/passing`);
  }

  //notif
  private notificationSubject = new Subject<string>();

  get notification$() {
    return this.notificationSubject.asObservable();
  }

  notify(message: string) {
    this.notificationSubject.next(message);
  }
}
