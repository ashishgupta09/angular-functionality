import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'user-data', pathMatch: "full" },
    { path: 'reactive-form', loadComponent: () => import('../app/components/reactive-form/reactive-form').then(m => m.ReactiveForm) },
    { path: 'templete-driven-from', loadComponent: () => import('../app/components/template-driven-form/template-driven-form').then(m => m.TemplateDrivenForm) },
    { path: 'observables', loadComponent: () => import('../app/components/observables/observables').then(m => m.Observables) },
    { path: 'user-data', loadComponent: () => import('../app/components/user-data/user-data').then(m => m.UserData) },
    { path: 'crud', loadComponent: () => import('../app/components/crud/crud').then(m => m.Crud) },
    { path: 'promise', loadComponent: () => import('../app/components/promise/promise').then(m => m.Promise) }
];
