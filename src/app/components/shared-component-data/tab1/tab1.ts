import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Data } from '../../../services/data';

@Component({
  selector: 'app-tab1',
  imports: [CommonModule, FormsModule],
  templateUrl: './tab1.html',
  styleUrl: './tab1.scss',
})
export class Tab1 {

  inputValue = '';

  constructor(
    private dataService: Data
  ) { }

  sendData() {
    this.dataService.setData(this.inputValue);
  }

}
