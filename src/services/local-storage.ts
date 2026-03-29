import { Injectable } from '@angular/core';
import { User } from '../interfaces/users';

@Injectable({
  providedIn: 'root',
})
export class LocalStorage {
  private key = 'users';

  getUsers(): User[] {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  addUser(user: User) {
    const users = this.getUsers();
    users.push(user);
    localStorage.setItem(this.key, JSON.stringify(users));
  }

  updateUser(index: number, user: User) {
    const users = this.getUsers();
    users[index] = user;
    localStorage.setItem(this.key, JSON.stringify(users));
  }

  deleteUser(index: number) {
    const users = this.getUsers();
    users.splice(index, 1);
    localStorage.setItem(this.key, JSON.stringify(users));
  }

}
