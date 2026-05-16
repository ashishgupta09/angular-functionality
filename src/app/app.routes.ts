import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'dynamic-form',
        loadComponent: () => import('../app/components/dynamic-forms/dynamic-forms')
            .then(c => c.DynamicForms)
    }
];