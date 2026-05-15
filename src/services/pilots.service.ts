import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Pilot } from "../app/models/pilots";

@Injectable({
    providedIn: 'root'
})
export class PilotService {
    apiUrl = "http://localhost:5000/api/Pilots";
    
    constructor(private http: HttpClient) { }

    getPilots(): Observable<Pilot[]> {
        return this.http.get<Pilot[]>(this.apiUrl);
    }

    createPilot(pilot: Pilot): Observable<Pilot> {
        return this.http.post<Pilot>(this.apiUrl, pilot);
    }

    editPilot(pilot: Pilot): Observable<Pilot> {
        return this.http.put<Pilot>(this.apiUrl, pilot);
    }

    deletePilot(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}?id=${id}`);
    }
}
