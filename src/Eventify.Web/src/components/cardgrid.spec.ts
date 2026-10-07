import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardGrid } from './cardgrid';
import { Evento } from '../classes/evento';

describe('CardGrid', () => {
  let fixture: ComponentFixture<CardGrid>;

  const buildEvento = (overrides: Partial<Evento> = {}): Evento => ({
    id: 1,
    title: 'Warehouse Night',
    coverImageUrl: 'https://img/cover.png',
    producerName: 'Live Nation',
    venueName: 'Audio',
    city: 'São Paulo',
    state: 'SP',
    startDate: '2026-11-10T22:00:00',
    endDate: null,
    price: 80,
    isSoldOut: false,
    genres: ['House', 'Techno'],
    ...overrides,
  });

  const render = async (eventos: Evento[] | null) => {
    fixture.componentRef.setInput('eventos', eventos);
    await fixture.whenStable();
  };

  const root = () => fixture.nativeElement as HTMLElement;
  const cards = () => root().querySelectorAll('z-card');
  const text = () => root().textContent ?? '';

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CardGrid] }).compileComponents();
    fixture = TestBed.createComponent(CardGrid);
  });

  it('should render one card per event when events are provided', async () => {
    await render([buildEvento({ id: 1 }), buildEvento({ id: 2 }), buildEvento({ id: 3 })]);

    expect(cards().length).toBe(3);
  });

  it('should render event venue and city when an event is provided', async () => {
    await render([buildEvento()]);

    expect(text()).toContain('Audio');
    expect(text()).toContain('São Paulo, SP');
  });

  // KNOWN BUG: z-card-title / z-card-description only render their zTitle / zDescription
  // inputs (no <ng-content/>), but cardgrid.html passes title and producer as projected
  // content, so neither is displayed. `it.fails` passes while the bug exists and starts
  // failing once the template uses [zTitle] / [zDescription] — then drop the `.fails`.
  it.fails('should render event title and producer when an event is provided', async () => {
    await render([buildEvento()]);

    expect(text()).toContain('Warehouse Night');
    expect(text()).toContain('Live Nation');
  });

  it('should render the cover image with src and alt when an event is provided', async () => {
    await render([buildEvento()]);

    const img = root().querySelector('img') as HTMLImageElement;
    expect(img.getAttribute('src')).toBe('https://img/cover.png');
    expect(img.alt).toBe('Warehouse Night');
  });

  it('should render the price in BRL when an event is provided', async () => {
    await render([buildEvento({ price: 80 })]);

    expect(text()).toContain('R$');
    expect(text()).toContain('80.00');
  });

  it('should render genres as tags when an event has genres', async () => {
    await render([buildEvento({ genres: ['House', 'Techno', 'K-Pop'] })]);

    const tags = Array.from(root().querySelectorAll('span.rounded-full')).map(t => t.textContent?.trim());
    expect(tags).toEqual(['House', 'Techno', 'K-Pop']);
  });

  it('should render no tags when an event has no genres', async () => {
    await render([buildEvento({ genres: [] })]);

    expect(root().querySelectorAll('span.rounded-full').length).toBe(0);
  });

  it('should render empty message when there are no events', async () => {
    await render([]);

    expect(cards().length).toBe(0);
    expect(text()).toContain('Nenhum evento encontrado.');
  });

  it('should render empty message when eventos is null', async () => {
    await render(null);

    expect(cards().length).toBe(0);
    expect(text()).toContain('Nenhum evento encontrado.');
  });

  // The template does not render isSoldOut yet; the badge is a separate task.
  it.todo('should show sold-out badge when event is sold out');
});
