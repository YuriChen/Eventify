import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EDarkModes, ZardDarkMode } from '@/shared/services/dark-mode';

export interface User {
  name: string;
  email: string;
  avatarUrl: string;
  isVip: boolean;
  ticketsCount: number;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header {
  /** Usuário logado. Se null, exibe versão visitante. */
  @Input() user: User | null = null;

  /** Cidade selecionada */
  @Input() city = 'SÃO PAULO, SP';

  /** Controla dropdown do perfil */
  isProfileOpen = signal(false);

  private readonly darkMode = inject(ZardDarkMode);

  readonly isDark = () => this.darkMode.themeMode() === EDarkModes.DARK;

  toggleTheme(): void {
    this.darkMode.toggleTheme();
  }

  toggleProfile(): void {
    this.isProfileOpen.update(v => !v);
  }
}