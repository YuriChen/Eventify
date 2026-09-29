import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Evento } from '../classes/evento';

import { ZardCardComponent } from '@/shared/components/card';
import { ZardCardHeaderComponent } from '@/shared/components/card';
import { ZardCardTitleComponent } from '@/shared/components/card';
import { ZardCardDescriptionComponent } from '@/shared/components/card';
import { ZardCardContentComponent } from '@/shared/components/card';
import { ZardCardFooterComponent } from '@/shared/components/card';

@Component({
  selector: 'app-card-grid',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ZardCardComponent,
    ZardCardHeaderComponent,
    ZardCardTitleComponent,
    ZardCardDescriptionComponent,
    ZardCardContentComponent,
    ZardCardFooterComponent
  ],
  templateUrl: './cardgrid.html',
  styleUrls: ['./cardgrid.css']
})
export class CardGrid {
  @Input() eventos: Evento[] | null = null;
}