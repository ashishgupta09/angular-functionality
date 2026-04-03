import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  combineLatestAll,
  concatAll,
  delay,
  exhaustAll,
  fromEvent,
  interval,
  map,
  mergeAll,
  of,
  startWith,
  switchAll,
  take,
  withLatestFrom
} from 'rxjs';

@Component({
  selector: 'app-join',
  imports: [CommonModule],
  templateUrl: './join.html',
  styleUrl: './join.scss',
})
export class Join implements OnInit, AfterViewInit {

  @ViewChild('btn') btn!: ElementRef;
  @ViewChild('search') input!: ElementRef;
  @ViewChild('search') search!: ElementRef;
  @ViewChild('filter') filter!: ElementRef;

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.exhaustAll_opertor();
    this.switchAll_opertor();
  }

  // combineLatestAll subscribes to multiple inner Observables and emits the latest values from all
  // of them whenever any of them emits.

  combineLatestAll_opertor() {
    const source$ = of(
      of('User Data').pipe(delay(1000)),
      of('Orders Data').pipe(delay(2000))
    );

    source$
      .pipe(combineLatestAll())
      .subscribe(([user, orders]) => {
        console.log(user, orders);
      });
  }

  // concatAll subscribes to inner Observables sequentially, waiting for one to complete before moving to the next.

  concatAll_opertor() {
    of(
      of('Login Success').pipe(delay(1000)),
      of('Profile Loaded').pipe(delay(1000))
    )
      .pipe(concatAll())
      .subscribe(console.log);
  }

  // exhaustAll ignores new incoming Observables while the current Observable is still active.

  exhaustAll_opertor() {
    fromEvent(this.btn.nativeElement, 'click')
      .pipe(
        map(() => interval(1000).pipe(take(3))),
        exhaustAll()
      )
      .subscribe(x => console.log('Processing:', x));
  }

  // mergeAll subscribes to all inner Observables simultaneously and emits their values as they arrive.

  mergeAll_opertor() {
    of(
      of('File1 uploaded').pipe(delay(2000)),
      of('File2 uploaded').pipe(delay(1000))
    )
      .pipe(mergeAll())
      .subscribe(console.log);
  }

  // switchAll switches to the latest inner Observable and cancels the previous one.

  switchAll_opertor() {
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        map(() => interval(1000)),
        switchAll()
      )
      .subscribe(console.log);
  }

  // startWith emits a specified initial value before the source Observable starts emitting values.

  startWith_opertor() {
    of('Actual Data')
      .pipe(startWith('Loading...'))
      .subscribe(console.log);
  }

  // withLatestFrom combines the source Observable with the latest value from another Observable whenever the source emits

  withLatestFrom_opertor() {
    const search$ = fromEvent(this.search.nativeElement, 'keyup')
      .pipe(map((e: any) => e.target.value));

    const filter$ = fromEvent(this.filter.nativeElement, 'change')
      .pipe(map((e: any) => e.target.value));

    search$
      .pipe(withLatestFrom(filter$))
      .subscribe(([search, filter]) => {
        console.log('Search:', search, 'Filter:', filter);
      });
  }


}
