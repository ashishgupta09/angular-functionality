import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: 'reactive-form', loadComponent: () => import('../app/components/reactive-form/reactive-form').then(m => m.ReactiveForm) },
    { path: 'templete-driven-from', loadComponent: () => import('../app/components/template-driven-form/template-driven-form').then(m => m.TemplateDrivenForm) }
];
