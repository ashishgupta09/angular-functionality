import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { from, of } from 'rxjs';

@Component({
  selector: 'app-observables',
  imports: [CommonModule],
  templateUrl: './observables.html',
  styleUrl: './observables.scss',
})
export class Observables implements OnInit {

  name = '';

  onInput(event$: Event) {
    let val = (event$.target) as HTMLInputElement
    this.name = val.value
  }

  ngOnInit(): void {
    this.of();
    this.form();
  }

  of() {
    of(1, 2, 3, 'Angular').subscribe(value => {
      console.log(value);
    });
  }

  form() {
    from([1, 2, 3]).subscribe(value => {
      console.log(value);
    });
  }

}
