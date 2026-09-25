import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZardComboboxImports } from '@/shared/components/combobox/combobox.imports';
import { ZardDatePickerComponent } from '@/shared/components/date-picker/date-picker.component';
import { Genero } from '../classes/genero';
import { ApiService } from '../services/api-service';


@Component({
  selector: 'app-event-list',
  imports: [ CommonModule, ZardComboboxImports, ZardDatePickerComponent],
  styleUrl: './event-list.scss',
  templateUrl: './event-list.html',
})
export class EventList implements OnInit 
{
  private apiService = inject(ApiService);
  generos = signal<Genero[]>([]);
  selectedGenre = signal<string | null>(null);

  ngOnInit(): void 
  {
    this.loadComboboxGenres();
  }

  private loadComboboxGenres (): void
  {
    this.apiService.getGenres().subscribe(
      {
        next: (dados) => this.generos.set(dados),
        error: (erro) => console.error('Erro ao carregar gêneros', erro)
      }
    );

  }
}
