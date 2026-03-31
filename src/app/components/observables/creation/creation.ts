import { CommonModule } from '@angular/common';
import { AfterContentInit, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  debounceTime,
  defer,
  from,
  fromEvent,
  iif,
  interval,
  map,
  of,
  range,
  scan,
  timer
} from 'rxjs';

@Component({
  selector: 'app-creation',
  imports: [CommonModule],
  templateUrl: './creation.html',
  styleUrl: './creation.scss',
})
export class Creation implements OnInit, AfterContentInit, AfterViewInit {

  @ViewChild('btn') button!: ElementRef;
  @ViewChild('searchBox') input!: ElementRef;

  //lifecycle hooks

  ngOnInit(): void {
    this.of_Oprerator();
    this.form_Oprerator();
    this.defer_Oprerator();
    this.iif_operator();
  }

  ngAfterContentInit(): void {

    // fromEvent creates an Observable from DOM events (click, input, scroll, etc.).

    fromEvent(window, 'scroll')
      .subscribe(() => {
        console.log('Scrolling...');
      });


    fromEvent(window, 'resize')
      .subscribe(() => {
        console.log('Width:', window.innerWidth);
      });

    fromEvent(document, 'click')
      .pipe(
        scan(count => count + 1, 0)
      )
      .subscribe(count => console.log('Clicks:', count));


    // formevent end
  }

  ngAfterViewInit(): void {

    // formevent start

    fromEvent(this.button.nativeElement, 'click').subscribe(() => {
      console.log('button click');
    })

    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(500),
        map((event: any) => event.target.value)
      )
      .subscribe(value => {
        console.log('Search:', value);
      });
  }

  //of is an RxJS creation operator that creates an Observable from a list of values and emits them sequentially as they are.

  of_Oprerator() {
    of(1, 2, 3, 'Angular').subscribe(value => {
      console.log(value);
    });
  }

  //from is an RxJS creation operator that converts iterable data sources like arrays, promises, or strings into an Observable
  //  and emits each value individually.

  form_Oprerator() {
    from([1, 2, 3]).subscribe(value => {
      console.log(value);
    });
  }

  //timer is an RxJS creation operator that emits a value after a specified delay, and can optionally continue emitting 
  // values at a given interval.

  timer__Oprerator() {
    timer(3000).subscribe(() => {
      console.log('Executed after 3 seconds');
    });
  }

  //interval is an RxJS creation operator that emits sequential numbers at a fixed time interval, starting from 0.

  intervale_Oprerator() {
    interval(5000).subscribe(() => {
      console.log('Calling API...');
    });
  }

  //defer creates an Observable lazily, meaning the logic inside it runs only when someone subscribes.

  defer_Oprerator() {
    const data$ = defer(() => {
      console.log('Observable created');
      return of(Math.random());
    });

    data$.subscribe(val => console.log('Value:', val));
    data$.subscribe(val => console.log('Value:', val));
  }

  //range creates an Observable that emits a sequence of numbers within a specified range.

  range_Operator() {
    range(1, 5).subscribe(val => console.log(val));
  }

  // iif conditionally creates an Observable based on a boolean condition at subscription time.

  iif_operator() {
    const isLoggedIn = false;

    const result$ = iif(
      () => isLoggedIn,
      of('Welcome User'),
      of('Please Login')
    );

    result$.subscribe(console.log);
  }
}
