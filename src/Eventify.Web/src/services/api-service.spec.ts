import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApiService } from './api-service';
import { Evento } from '../classes/evento';
import { Genero } from '../classes/genero';

describe('ApiService', () => {
  let service: ApiService;
  let http: HttpTestingController;

  const evento: Evento = {
    id: 1,
    title: 'Warehouse Night',
    coverImageUrl: 'https://img/cover.png',
    producerName: 'Producer',
    venueName: 'Venue',
    city: 'São Paulo',
    state: 'SP',
    startDate: '2026-11-10T22:00:00',
    endDate: null,
    price: 80,
    isSoldOut: false,
    genres: ['House', 'Techno'],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  describe('getGenres', () => {
    it('should call GET /api/genres when getGenres is called', () => {
      service.getGenres().subscribe();

      const req = http.expectOne('/api/genres');
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });

    it('should return genres from the response when getGenres succeeds', () => {
      const genres = [new Genero(1, 'House'), new Genero(2, 'Techno')];
      let result: Genero[] | undefined;

      service.getGenres().subscribe(g => (result = g));
      http.expectOne('/api/genres').flush(genres);

      expect(result).toEqual(genres);
    });
  });

  describe('getEvents', () => {
    const expectEventsRequest = () => http.expectOne(r => r.url === '/api/events');

    it('should call GET /api/events without params when the filter is empty', () => {
      service.getEvents({}).subscribe();

      const req = expectEventsRequest();
      expect(req.request.method).toBe('GET');
      expect(req.request.params.keys()).toEqual([]);
      req.flush([]);
    });

    it('should build HttpParams with cityId when provided', () => {
      service.getEvents({ cityId: '2' }).subscribe();

      const req = expectEventsRequest();
      expect(req.request.params.get('cityId')).toBe('2');
      req.flush([]);
    });

    it('should build HttpParams with multiple genresIds using append when several genres are provided', () => {
      service.getEvents({ genresIds: ['1', '3', '5'] }).subscribe();

      const req = expectEventsRequest();
      expect(req.request.params.getAll('genresIds')).toEqual(['1', '3', '5']);
      expect(req.request.urlWithParams).toBe('/api/events?genresIds=1&genresIds=3&genresIds=5');
      req.flush([]);
    });

    it('should build HttpParams with startDate unchanged when provided', () => {
      service.getEvents({ startDate: '2026-11-10' }).subscribe();

      const req = expectEventsRequest();
      expect(req.request.params.get('startDate')).toBe('2026-11-10');
      req.flush([]);
    });

    it('should build HttpParams with endDate when provided', () => {
      service.getEvents({ endDate: '2026-12-31' }).subscribe();

      const req = expectEventsRequest();
      expect(req.request.params.get('endDate')).toBe('2026-12-31');
      req.flush([]);
    });

    it('should build HttpParams with every filter when all filters are provided', () => {
      service
        .getEvents({ cityId: '1', genresIds: ['2', '4'], startDate: '2026-11-01', endDate: '2026-11-30' })
        .subscribe();

      const req = expectEventsRequest();
      expect(req.request.params.get('cityId')).toBe('1');
      expect(req.request.params.getAll('genresIds')).toEqual(['2', '4']);
      expect(req.request.params.get('startDate')).toBe('2026-11-01');
      expect(req.request.params.get('endDate')).toBe('2026-11-30');
      req.flush([]);
    });

    it('should omit empty filters from HttpParams when values are undefined or empty', () => {
      service
        .getEvents({ cityId: '', genresIds: [], startDate: '', endDate: undefined })
        .subscribe();

      const req = expectEventsRequest();
      expect(req.request.params.keys()).toEqual([]);
      req.flush([]);
    });

    it('should return events from the response when getEvents succeeds', () => {
      let result: Evento[] | undefined;

      service.getEvents({}).subscribe(e => (result = e));
      expectEventsRequest().flush([evento]);

      expect(result).toEqual([evento]);
    });

    it('should propagate the error when the request fails', () => {
      let status: number | undefined;

      service.getEvents({}).subscribe({ error: e => (status = e.status) });
      expectEventsRequest().flush('boom', { status: 500, statusText: 'Server Error' });

      expect(status).toBe(500);
    });
  });
});
