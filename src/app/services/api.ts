import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user.model';

@Injectable({
  providedIn: 'root',
})
export class Api {

  API_URL = "https://dummyjson.com/users"

  constructor(private http: HttpClient) { }


  // ✅ Get All Users
  getUsers(): Observable<{ users: User[] }> {
    return this.http.get<{ users: User[] }>(this.API_URL);
  }

  // ✅ Get Single User
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/${id}`);
  }

  // ADD user
  addUser(user: any): Observable<any> {
    return this.http.post(`${this.API_URL}/add`, user);
  }

  // UPDATE user
  updateUser(id: number, user: any): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}`, user);
  }

  // DELETE user
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}
