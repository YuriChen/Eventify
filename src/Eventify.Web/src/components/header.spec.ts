import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Header } from './header';
import { EDarkModes, ZardDarkMode } from '@/shared/services/dark-mode';

describe('Header', () => {
  let fixture: ComponentFixture<Header>;
  let darkMode: ZardDarkMode;

  const toggleButton = () =>
    (fixture.nativeElement as HTMLElement).querySelector('button[aria-label*="tema"]') as HTMLButtonElement;

  beforeEach(async () => {
    localStorage.removeItem('theme');
    await TestBed.configureTestingModule({ imports: [Header] }).compileComponents();
    darkMode = TestBed.inject(ZardDarkMode);
    darkMode.init();
    darkMode.toggleTheme(EDarkModes.LIGHT);
    fixture = TestBed.createComponent(Header);
    await fixture.whenStable();
  });

  it('should switch the theme to dark when the toggle is clicked in light mode', async () => {
    toggleButton().click();
    await fixture.whenStable();

    expect(darkMode.themeMode()).toBe(EDarkModes.DARK);
    expect(toggleButton().getAttribute('aria-label')).toBe('Ativar tema claro');
  });

  it('should switch the theme back to light when the toggle is clicked in dark mode', async () => {
    toggleButton().click();
    toggleButton().click();
    await fixture.whenStable();

    expect(darkMode.themeMode()).toBe(EDarkModes.LIGHT);
  });
});
