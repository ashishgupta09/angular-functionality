import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../interfaces/users';
import { LocalStorage } from '../../services/local-storage';
import { Promise } from '../promise/promise';

@Component({
  selector: 'app-user-data',
  imports: [
    CommonModule,
    FormsModule,
    Promise
  ],
  templateUrl: './user-data.html',
  styleUrl: './user-data.scss',
})
export class UserData {

  isOpen = false;
  selected = 'Select Option';
  options = ['Angular', 'React', 'Vue'];
  mail = "Hello! from the Ashish";

  @Input() message!: string;
  @Output() notify = new EventEmitter<string>();
  tab = 'tab1';

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

  sendData() {
    this.notify.emit('Hello Parent');
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  selectOption(option: string) {
    this.selected = option;
    this.isOpen = false;
  }

  receiveData(data: string) {
    console.log(data);
  }

}
