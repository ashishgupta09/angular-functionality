import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'user-data', pathMatch: "full" },
    {
        path:
            'reactive-form',
        loadComponent: () => import('../app/components/reactive-form/reactive-form')
            .then(m => m.ReactiveForm)
    },
    {
        path: 'templete-driven-from',
        loadComponent: () => import('../app/components/template-driven-form/template-driven-form')
            .then(m => m.TemplateDrivenForm)
    },
    {
        path: 'creation',
        loadComponent: () => import('./components/observables/creation/creation')
            .then(m => m.Creation)
    },
    {
        path: 'join-creation',
        loadComponent: () => import('./components/observables/join-creation/join-creation')
            .then(m => m.JoinCreation)
    },
    {
        path: 'user-data',
        loadComponent: () => import('../app/components/user-data/user-data')
            .then(m => m.UserData)
    },
    {
        path: 'crud',
        loadComponent: () => import('../app/components/crud/crud')
            .then(m => m.Crud)
    },
    {
        path: 'promise',
        loadComponent: () => import('../app/components/promise/promise')
            .then(m => m.Promise)
    },
    {
        path: 'math-operators',
        loadComponent: () => import('../app/components/observables/math-operations/math-operations')
            .then(m => m.MathOperations)
    },
    {
        path: 'condition-boolean-opertors',
        loadComponent: () => import('../app/components/observables/condition-boolean-opertors/condition-boolean-opertors')
            .then(m => m.ConditionBooleanOpertors)
    },
    {
        path: 'multicasting',
        loadComponent: () => import('../app/components/observables/multicasting/multicasting')
            .then(m => m.Multicasting)
    }

];
