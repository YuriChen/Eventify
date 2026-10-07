import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { EventList } from './event-list';
import { ApiService } from '../services/api-service';
import { Evento } from '../classes/evento';
import { Genero } from '../classes/genero';

describe('EventList', () => {
  let fixture: ComponentFixture<EventList>;
  let component: EventList;

  const apiService = {
    getGenres: vi.fn<() => Observable<Genero[]>>(),
    getEvents: vi.fn<(filter: unknown) => Observable<Evento[]>>(),
  };

  const generos = [new Genero(1, 'House'), new Genero(2, 'Techno'), new Genero(3, 'Rock')];

  const buildEvento = (id: number): Evento => ({
    id,
    title: `Evento ${id}`,
    coverImageUrl: 'https://img/cover.png',
    producerName: 'Producer',
    venueName: 'Venue',
    city: 'São Paulo',
    state: 'SP',
    startDate: '2026-11-10T22:00:00',
    endDate: null,
    price: 80,
    isSoldOut: false,
    genres: ['House'],
  });

  // Creates the component and runs ngOnInit (which loads genres and events).
  const createComponent = async () => {
    fixture = TestBed.createComponent(EventList);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  };

  beforeEach(() => {
    apiService.getGenres.mockReset().mockReturnValue(of(generos));
    apiService.getEvents.mockReset().mockReturnValue(of([buildEvento(1), buildEvento(2)]));

    TestBed.configureTestingModule({
      imports: [EventList],
      providers: [provideRouter([]), { provide: ApiService, useValue: apiService }],
    });
  });

  afterEach(() => vi.restoreAllMocks());

  it('should create', async () => {
    await createComponent();

    expect(component).toBeTruthy();
  });

  describe('on init', () => {
    it('should load genres on init', async () => {
      await createComponent();

      expect(apiService.getGenres).toHaveBeenCalledTimes(1);
      expect(component.generos()).toEqual(generos);
    });

    it('should load events on init', async () => {
      await createComponent();

      expect(apiService.getEvents).toHaveBeenCalledTimes(1);
      expect(component.eventos().map(e => e.id)).toEqual([1, 2]);
    });

    it('should call getEvents with an empty filter when nothing is selected', async () => {
      await createComponent();

      expect(apiService.getEvents).toHaveBeenCalledWith({
        cityId: undefined,
        genresIds: undefined,
        startDate: undefined,
      });
    });

    it('should keep eventos empty and log the error when loading events fails', async () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      apiService.getEvents.mockReturnValue(throwError(() => new Error('boom')));

      await createComponent();

      expect(component.eventos()).toEqual([]);
      expect(error).toHaveBeenCalledWith('Erro ao carregar eventos', expect.any(Error));
    });

    it('should keep generos empty and log the error when loading genres fails', async () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      apiService.getGenres.mockReturnValue(throwError(() => new Error('boom')));

      await createComponent();

      expect(component.generos()).toEqual([]);
      expect(error).toHaveBeenCalledWith('Erro ao carregar gêneros', expect.any(Error));
    });
  });

  describe('loadEventsGrid', () => {
    beforeEach(async () => {
      await createComponent();
      apiService.getEvents.mockClear();
    });

    it('should reload events with cityId when the city filter changes', () => {
      component.selectedCity.set('2');

      component.loadEventsGrid();

      expect(apiService.getEvents).toHaveBeenCalledWith({
        cityId: '2',
        genresIds: undefined,
        startDate: undefined,
      });
    });

    it('should reload events with genresIds when the genres filter changes', () => {
      component.selectedGenres.set(['1', '3']);

      component.loadEventsGrid();

      expect(apiService.getEvents).toHaveBeenCalledWith({
        cityId: undefined,
        genresIds: ['1', '3'],
        startDate: undefined,
      });
    });

    it('should omit genresIds when no genre is selected', () => {
      component.selectedGenres.set(['1']);
      component.selectedGenres.set([]);

      component.loadEventsGrid();

      expect(apiService.getEvents).toHaveBeenCalledWith(expect.objectContaining({ genresIds: undefined }));
    });

    it('should convert selected date to ISO string when building filters', () => {
      // Local noon keeps the UTC date equal to the local date in (almost) every time zone.
      component.selectedStartDate.set(new Date(2026, 10, 15, 12, 0, 0));

      component.loadEventsGrid();

      expect(apiService.getEvents).toHaveBeenCalledWith(expect.objectContaining({ startDate: '2026-11-15' }));
    });

    it('should omit startDate when no date is selected', () => {
      component.selectedStartDate.set(null);

      component.loadEventsGrid();

      expect(apiService.getEvents).toHaveBeenCalledWith(expect.objectContaining({ startDate: undefined }));
    });

    it('should send all selected filters together when several are set', () => {
      component.selectedCity.set('1');
      component.selectedGenres.set(['2']);
      component.selectedStartDate.set(new Date(2026, 11, 5, 12, 0, 0));

      component.loadEventsGrid();

      expect(apiService.getEvents).toHaveBeenCalledWith({
        cityId: '1',
        genresIds: ['2'],
        startDate: '2026-12-05',
      });
    });

    it('should replace eventos with the new response when events are reloaded', () => {
      apiService.getEvents.mockReturnValue(of([buildEvento(9)]));

      component.loadEventsGrid();

      expect(component.eventos().map(e => e.id)).toEqual([9]);
    });

    it('should reload events when the city combobox value changes', () => {
      fixture.debugElement.query(By.css('#cbCities')).triggerEventHandler('zValueChange', '2');

      expect(component.selectedCity()).toBe('2');
      expect(apiService.getEvents).toHaveBeenCalledWith(expect.objectContaining({ cityId: '2' }));
    });
  });

  describe('genreNameFindById', () => {
    beforeEach(async () => {
      await createComponent();
    });

    it('should find genre name by id when genre exists', () => {
      expect(component.genreNameFindById('2')).toBe('Techno');
    });

    it('should return id when genre is not found', () => {
      expect(component.genreNameFindById('99')).toBe('99');
    });
  });
});
