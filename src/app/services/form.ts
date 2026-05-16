import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FormField } from '../interfaces/form-field.interface';

@Injectable({
  providedIn: 'root',
})
export class Form {
  private http = inject(HttpClient);
  private api = 'http://localhost:3000';

  getFromField(): Observable<FormField[]> {
    return this.http.get<FormField[]>(`${this.api}/formFields`);
  }

  addFormData(forms: FormField): Observable<FormField[]> {
    return this.http.post<FormField[]>(`${this.api}/users`, forms);
  }
}
