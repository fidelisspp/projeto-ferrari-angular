import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { Pilot } from "../app/models/pilots";

@Injectable({
    providedIn: 'root'
})
export class PilotService {
    apiUrl = "http://localhost:5000/api/Pilots";
    private useMock = false;
    
    constructor(private http: HttpClient) { }

    private getMockPilots(): Pilot[] {
        const pilots = localStorage.getItem('mock_pilots');
        if (!pilots) {
            const initialPilots: Pilot[] = [
                { id: 1, name: 'Charles Leclerc', age: 25, nationality: 'Monaco', weight: '69', height: '1.80', number: 16 },
                { id: 2, name: 'Carlos Sainz', age: 28, nationality: 'Spain', weight: '72', height: '1.78', number: 55 }
            ];
            localStorage.setItem('mock_pilots', JSON.stringify(initialPilots));
            return initialPilots;
        }
        return JSON.parse(pilots);
    }

    private saveMockPilots(pilots: Pilot[]): void {
        localStorage.setItem('mock_pilots', JSON.stringify(pilots));
    }

    getPilots(): Observable<Pilot[]> {
        return this.http.get<Pilot[]>(this.apiUrl).pipe(
            catchError(err => {
                console.warn("Backend offline. Usando mock no localStorage como fallback.", err);
                this.useMock = true;
                return of(this.getMockPilots());
            })
        );
    }

    createPilot(pilot: Pilot): Observable<Pilot> {
        if (this.useMock) {
            const pilots = this.getMockPilots();
            const newId = pilots.length > 0 ? Math.max(...pilots.map(p => p.id || 0)) + 1 : 1;
            const newPilot = { ...pilot, id: newId };
            pilots.push(newPilot);
            this.saveMockPilots(pilots);
            return of(newPilot);
        }
        return this.http.post<Pilot>(this.apiUrl, pilot).pipe(
            catchError(err => {
                console.warn("Erro ao criar piloto no backend. Usando mock no localStorage.", err);
                this.useMock = true;
                return this.createPilot(pilot);
            })
        );
    }

    editPilot(pilot: Pilot): Observable<Pilot> {
        if (this.useMock) {
            const pilots = this.getMockPilots();
            const index = pilots.findIndex(p => p.id === pilot.id);
            if (index !== -1) {
                pilots[index] = pilot;
                this.saveMockPilots(pilots);
            }
            return of(pilot);
        }
        return this.http.put<Pilot>(this.apiUrl, pilot).pipe(
            catchError(err => {
                console.warn("Erro ao editar piloto no backend. Usando mock no localStorage.", err);
                this.useMock = true;
                return this.editPilot(pilot);
            })
        );
    }

    deletePilot(id: number): Observable<any> {
        if (this.useMock) {
            let pilots = this.getMockPilots();
            pilots = pilots.filter(p => p.id !== id);
            this.saveMockPilots(pilots);
            return of({ success: true });
        }
        return this.http.delete<any>(`${this.apiUrl}?id=${id}`).pipe(
            catchError(err => {
                console.warn("Erro ao deletar piloto no backend. Usando mock no localStorage.", err);
                this.useMock = true;
                return this.deletePilot(id);
            })
        );
    }
}
