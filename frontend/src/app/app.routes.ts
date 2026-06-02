import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'kanban',
    loadComponent: () =>
      import('./features/tasks/pages/kanban-page.component').then(
        (m) => m.KanbanPageComponent
      )
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'kanban'
  },
  {
    path: '**',
    redirectTo: 'kanban'
  }
];
