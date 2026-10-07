import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, RouterOutlet } from '@angular/router';
import { App } from './app';
import { Header } from '../components/header';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the header when the app is rendered', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const header = fixture.nativeElement.querySelector('app-header') as HTMLElement | null;
    expect(header).not.toBeNull();
    expect(header?.querySelector('header')).not.toBeNull();
  });

  it('should pass the city to the header when the app is rendered', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const header = fixture.debugElement.query(By.directive(Header)).componentInstance as Header;
    expect(header.city).toBe('SÃO PAULO, SP');
  });

  it('should render the router outlet inside main when the app is rendered', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const outlet = fixture.debugElement.query(By.directive(RouterOutlet));
    expect(outlet).not.toBeNull();
    expect(outlet.nativeElement.closest('main')).not.toBeNull();
  });
});
