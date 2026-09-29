import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Genero } from "../classes/genero";
import { Evento } from '../classes/evento';
import { EventFilter } from '../pages/event-list';


@Injectable({ providedIn: 'root' })
export class ApiService 
{
  private http = inject(HttpClient);
  private apiUrl = '/api';

  getGenres(): Observable<Genero[]> 
  {
    return this.http.get<Genero[]>(this.apiUrl + '/genres');
  }

  getEvents(eventsFilter: EventFilter): Observable<Evento[]>
  {
    let params = new HttpParams();

    if (eventsFilter.cityId) {
      params = params.set('cityId', eventsFilter.cityId);
    }

    if (eventsFilter.genresIds?.length) 
    {
      eventsFilter.genresIds.forEach(id => {
        params = params.append('genresIds', id);
      });
    }

    if (eventsFilter.startDate) {
      params = params.set('startDate', eventsFilter.startDate);
    }

    if (eventsFilter.endDate) {
      params = params.set('endDate', eventsFilter.endDate);
    }

    return this.http.get<Evento[]>(this.apiUrl + '/events', {params});
  }
}