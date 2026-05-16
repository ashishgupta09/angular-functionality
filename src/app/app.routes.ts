import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'employess', pathMatch: 'full' },
  {
    path: 'dynamic-form',
    loadComponent: () =>
      import('../app/components/dynamic-forms/dynamic-forms').then((c) => c.DynamicForms),
  },
  {
    path: 'employess',
    loadComponent: () => import('../app/components/employees/employees').then((c) => c.Employees),
  },
];
