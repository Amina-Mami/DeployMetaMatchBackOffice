import { HttpClient, HttpHeaders,HttpErrorResponse ,HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable ,throwError  } from 'rxjs';
import { Injury } from './injury'
import { joueur } from './joueur';
import { catchError } from 'rxjs/operators';
import { Useratribute } from '../user/Useratribute';
import { User } from 'app/auth/models';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
    providedIn: 'root'
})
export class ServiceInjury {
    apiUrl = "http://localhost:3000/injury";
    joueurApiUrl = "http://localhost:3000/injury/players";
    constructor(private http: HttpClient) { }

    getInjuries() {
        return this.http.get<Injury[]>(this.apiUrl + "/getAllInjury");
    }

   
    addInjury(injury: Injury) {
        return this.http.post<any>(this.apiUrl + "/addInjury", injury, httpOptions);
    }

      deleteInjury(injuryId: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/deleteInjury/${injuryId}`);
      }
    
      

     

    updateInjury(idInjury: string, injury: Injury): Observable<Injury> {
        return this.http.put<Injury>(`${this.apiUrl}/updateInjury/${idInjury}` , injury);

    }

    findInjuryById(id: string): Observable<Injury> {
        const url = `${this.apiUrl + "/getInjurybyid"}/${id}`;
        return this.http.get<Injury>(url, httpOptions)
    }
  
    getJoueurs() {
        return this.http.get<User[]>(this.joueurApiUrl);
    }



    uploadCSV(file: File): Observable<any> {
      const formData: FormData = new FormData();
      formData.append('csvFile', file, file.name);
      
      return this.http.post(`${this.apiUrl}/upload-csv`, formData);
    }
    

    archiveInjury(injuryId: string): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/archive/${injuryId}`, {});
      }

      getInjuriesByTypeStats(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/injuriesByTypeStats`);
      }
    
      getInjuriesByRecoveryStatusStats(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/injuriesByRecoveryStatusStats`);
      }
      
      getInjuriesByYearStats(year: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/injuriesByYearStats/${year}`);
      }
      
      predict(age: number, position: string, team: string, nationality: string) {
        return this.http.post('http://localhost:3000/predict', {
          age,
          position,
          team,
          nationality
        });
      }
    
}
