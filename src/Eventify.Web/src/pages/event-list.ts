import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZardComboboxImports } from '@/shared/components/combobox/combobox.imports';
import { ZardDatePickerComponent } from '@/shared/components/date-picker/date-picker.component';
import { CalendarValue } from '@/shared/components/calendar/calendar.types';
import { CardGrid } from '../components/cardgrid';
import { Genero } from '../classes/genero';
import { ApiService } from '../services/api-service';
import { Evento } from '../classes/evento';
import { accentInsensitiveFilter } from '../utils/text-filter';

export interface EventFilter {
  cityId?: string;
  genresIds?: string[];
  startDate?: string;
  endDate?: string;
}

@Component({
  selector: 'app-event-list',
  imports: [CommonModule, ZardComboboxImports, ZardDatePickerComponent, CardGrid],
  styleUrl: './event-list.scss',
  templateUrl: './event-list.html',
})
export class EventList implements OnInit 
{
  private apiService = inject(ApiService);
  generos = signal<Genero[]>([]);
  eventos = signal<Evento[]>([]);
  selectedCity = signal<string | null>(null);
  selectedStartDate = signal<CalendarValue>(null);
  selectedGenres = signal<string[]>([]);
  readonly accentInsensitiveFilter = accentInsensitiveFilter;

  ngOnInit(): void 
  {
    this.loadComboboxGenres();
    this.loadEventsGrid();
  }

  private loadComboboxGenres(): void
  {
    this.apiService.getGenres().subscribe({
      next: (dados) => this.generos.set(dados),
      error: (erro) => console.error('Erro ao carregar gêneros', erro)
    });
  }

  loadEventsGrid(): void
  {
    const startDate = this.selectedStartDate();

    const eventsFilter: EventFilter = {
      cityId: this.selectedCity() ?? undefined,
      genresIds: this.selectedGenres().length ? this.selectedGenres() : undefined,
      startDate: startDate instanceof Date
        ? startDate.toISOString().split('T')[0]
        : undefined
    };

    this.apiService.getEvents(eventsFilter).subscribe({
      next: (dados) => this.eventos.set(dados),
      error: (erro) => console.error('Erro ao carregar eventos', erro)
    });
  }

  genreNameFindById(value: string): string {
    return this.generos().find(g => g.id.toString() === value)?.name ?? value;
  }
}