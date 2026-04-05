import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  count,
  from,
  max,
  min,
  reduce
} from 'rxjs';

@Component({
  selector: 'app-math-operations',
  imports: [CommonModule],
  templateUrl: './math-operations.html',
  styleUrl: './math-operations.scss',
})
export class MathOperations implements OnInit {

  total = 0;

  ngOnInit(): void {
    this.count_operators();
    this.getMax();
    this.getMin();
    this.getSum();
  }

  // count counts the number of emissions from an Observable and emits the total when it completes.

  count_operators() {
    from([10, 20, 30, 40])
      .pipe(count())
      .subscribe(res => this.total = res);
  }

  // max finds and emits the maximum value from an Observable when it completes.

  getMax() {
    from([5, 15, 10, 25])
      .pipe(max())
      .subscribe(res => console.log('Max:', res));
  }

  // min finds and emits the minimum value from an Observable when it completes.

  getMin() {
    from([5, 15, 10, 2])
      .pipe(min())
      .subscribe(res => console.log('Min:', res));
  }

  // reduce accumulates all emitted values into a single result and emits it when the Observable completes.

  getSum() {
    from([10, 20, 30])
      .pipe(
        reduce((acc, value) => acc + value, 0)
      )
      .subscribe(res => console.log('Sum:', res));
  }

}
