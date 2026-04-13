import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Data } from '../../../services/data';

@Component({
  selector: 'app-tab2',
  imports: [CommonModule],
  templateUrl: './tab2.html',
  styleUrl: './tab2.scss',
})
export class Tab2 {
  data = '';

  constructor(
    private dataService: Data
  ) {
    this.dataService.currentData$.subscribe(res => {
      this.data = res;
    })
  }

}
