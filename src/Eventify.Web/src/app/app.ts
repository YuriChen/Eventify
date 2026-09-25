import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header, User } from '../components/header';

@Component({
  imports: [RouterOutlet, Header],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('eventify-web');

  currentUser: User | null = null;

  /*null = {
  name: 'Larissa M.',
  email: 'larissa.m@live.pulse',
  avatarUrl: 'https://i.pravatar.cc/100?img=5',
  isVip: true,
  ticketsCount: 2
  };*/
}
