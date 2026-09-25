import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'explorar',
        pathMatch: 'full'
    },
    {
        path: 'explorar',
        loadComponent: () => import('../pages/event-list')
                                    .then(m => m.EventList),
        title: 'Explorar Eventos — Eventify'
    },
    {
        path: '**',
        redirectTo: 'explorar'
    }
];
