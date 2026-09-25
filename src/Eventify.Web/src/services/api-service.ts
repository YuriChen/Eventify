import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Genero } from "../classes/genero";


@Injectable({ providedIn: 'root' })
export class ApiService 
{
  private http = inject(HttpClient);
  private apiUrl = '/api/genres';

  getGenres(): Observable<Genero[]> {
    return this.http.get<Genero[]>(this.apiUrl);
  }
}