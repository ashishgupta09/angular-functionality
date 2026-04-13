import { Component } from '@angular/core';
import { Data } from '../../../services/data';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab3',
  imports: [CommonModule],
  templateUrl: './tab3.html',
  styleUrl: './tab3.scss',
})
export class Tab3 {
  latestData = '';

  constructor(private dataService: Data) {
    this.dataService.currentData$.subscribe(res => {
      this.latestData = res;
    });
  }

  logData() {
    console.log(this.latestData);
  }
}
