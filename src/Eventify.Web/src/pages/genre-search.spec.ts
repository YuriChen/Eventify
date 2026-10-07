import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { EventList } from './event-list';
import { ApiService } from '../services/api-service';
import { Genero } from '../classes/genero';
import { ZardComboboxComponent } from '@/shared/components/combobox/combobox.component';
import { ZardComboboxItemComponent } from '@/shared/components/combobox/combobox-item.component';

describe('EventList genres combobox search', () => {
  const generos = [new Genero(1, 'House'), new Genero(2, 'Eletrônica'), new Genero(3, 'Rock')];

  const setup = async () => {
    TestBed.configureTestingModule({
      imports: [EventList],
      providers: [
        provideRouter([]),
        { provide: ApiService, useValue: { getGenres: () => of(generos), getEvents: () => of([]) } },
      ],
    });
    const fixture = TestBed.createComponent(EventList);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();

    const combos = fixture.debugElement.queryAll(By.directive(ZardComboboxComponent));
    const genres = combos[1].componentInstance as ZardComboboxComponent;
    // Items live in the popup template (not attached until opened), so read them from the combobox registry.
    const items = (genres as unknown as { items(): ZardComboboxItemComponent[] }).items();
    return { genres, items };
  };

  it('should label each genre item with its name, keeping the id as its value', async () => {
    const { items } = await setup();

    expect(items.map(i => i.zValue())).toEqual(['1', '2', '3']);
    expect(items.map(i => i.label())).toEqual(['House', 'Eletrônica', 'Rock']);
  });

  it('should show only the matching genre when the user types part of its name', async () => {
    const { genres, items } = await setup();

    genres.setQuery('eletronica');

    expect(items.filter(i => !i.isHidden()).map(i => i.zValue())).toEqual(['2']);
  });
});
