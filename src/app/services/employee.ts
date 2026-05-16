import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EmployeeModel } from '../interfaces/employee.interface';

@Injectable({
  providedIn: 'root',
})
export class Employee {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/employees';

  getEmployees(): Observable<EmployeeModel[]> {
    return this.http.get<EmployeeModel[]>(this.apiUrl);
  }

  addEmployee(data: EmployeeModel) {
    return this.http.post(this.apiUrl, data);
  }

  updateEmployee(id: number, data: EmployeeModel) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteEmployee(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
