import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { User } from '../../interfaces/users';
import { LocalStorage } from '../../services/local-storage';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-data',
  imports: [CommonModule,FormsModule],
  templateUrl: './user-data.html',
  styleUrl: './user-data.scss',
})
export class UserData {
  users: User[] = [];

  user: User = {
    name: '',
    email: '',
    phone: '',
    address: '',
    pincode: '',
    city: ''
  };

  editIndex: number | null = null;
  isModalOpen = false;

  constructor(private storage: LocalStorage) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.users = this.storage.getUsers();
  }

  openModal() {
    this.user = {
      name: '',
      email: '',
      phone: '',
      address: '',
      pincode: '',
      city: ''
    };
    this.editIndex = null;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveUser() {
    if (this.editIndex !== null) {
      this.storage.updateUser(this.editIndex, this.user);
    } else {
      this.storage.addUser(this.user);
    }

    this.loadUsers();
    this.closeModal();
  }

  editUser(index: number) {
    this.user = { ...this.users[index] };
    this.editIndex = index;
    this.isModalOpen = true;
  }

  deleteUser(index: number) {
    this.storage.deleteUser(index);
    this.loadUsers();
  }
}
