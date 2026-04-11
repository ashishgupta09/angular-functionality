import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/user.model';
import { Api } from '../../services/api';
import { CapitalizePipe } from '../../pipes/capitalize-pipe';
import { UserData } from '../user-data/user-data';

@Component({
  selector: 'app-crud',
  imports: [CommonModule, CapitalizePipe, UserData],
  templateUrl: './crud.html',
  styleUrl: './crud.scss',
})
export class Crud implements OnInit {
  parentMsg = 'Hello from Parent';
  users: User[] = [];
  selectedUser!: User;

  constructor(private userService: Api) { }

  ngOnInit() {
    this.getUsers();
  }

  // ✅ Get All Users
  getUsers() {
    this.userService.getUsers().subscribe({
      next: (res) => {
        this.users = res.users; // IMPORTANT
      },
      error: (err) => {
        console.error('Error fetching users', err);
      }
    });
  }

  // ✅ Get Single User
  getUser(id: number) {
    this.userService.getUserById(id).subscribe({
      next: (res) => {
        this.selectedUser = res;
        console.log('Single User:', res);
      },
      error: (err) => {
        console.error('Error fetching user', err);
      }
    });
  }

  trackById(index: number, item: User) {
    return item.id;
  }

  receiveData(data: string) {
    console.log(data);
  }
}
