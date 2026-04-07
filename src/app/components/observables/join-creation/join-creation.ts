import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  combineLatest,
  concat,
  debounceTime,
  delay,
  forkJoin,
  from,
  fromEvent,
  interval,
  map,
  merge,
  of,
  partition,
  zip
} from 'rxjs';
import { ajax } from 'rxjs/ajax';

@Component({
  selector: 'app-join-creation',
  imports: [CommonModule],
  templateUrl: './join-creation.html',
  styleUrl: './join-creation.scss',
})
export class JoinCreation implements OnInit, AfterViewInit {

  @ViewChild('searchBox') searchBox!: ElementRef;
  @ViewChild('category') category!: ElementRef;
  result: string[] = [];

  ngOnInit(): void {
    this.concat_Operator();
    this.forkJoin_Operator();
    this.partition_Operator();
    this.race_Operator();
  }

  ngAfterViewInit() {
    this.combineLatest_Operator();
  }

  // combineLatest combines multiple Observables and emits the latest values from each whenever any of them emits.

  combineLatest_Operator() {
    const search$ = fromEvent(this.searchBox.nativeElement, 'keyup')
      .pipe(
        debounceTime(300),
        map((e: any) => e.target.value)
      );

    const category$ = fromEvent(this.category.nativeElement, 'change')
      .pipe(map((e: any) => e.target.value));

    combineLatest([search$, category$])
      .subscribe(([search, cat]) => {
        console.log('Search:', search, 'Category:', cat);
      });
  }

  // concat executes Observables sequentially, waiting for one to complete before starting the next.

  concat_Operator() {
    const login$ = of('User logged in').pipe(delay(1000));
    const profile$ = of('Profile loaded').pipe(delay(1000));

    concat(login$, profile$)
      .subscribe(console.log);
  }

  // forkJoin waits for all Observables to complete and then emits their last values.

  forkJoin_Operator() {
    forkJoin({
      users: ajax.getJSON('https://jsonplaceholder.typicode.com/users'),
      posts: ajax.getJSON('https://jsonplaceholder.typicode.com/posts')
    }).subscribe(result => {
      console.log('Users:', result.users);
      console.log('Posts:', result.posts);
    });
  }

  // merge combines multiple Observables and emits values as they arrive, without waiting.

  merge_Operator() {
    const fast$ = interval(500).pipe(map(() => 'FAST'));
    const slow$ = interval(1000).pipe(map(() => 'SLOW'));

    merge(fast$, slow$)
      .subscribe(console.log);
  }

  // partition splits an Observable into two based on a condition.

  partition_Operator() {
    const users$ = from([
      { name: 'A', role: 'admin' },
      { name: 'B', role: 'user' }
    ]);

    const [admin$, user$] = partition(users$, u => u.role === 'admin');

    admin$.subscribe(x => console.log('Admin:', x));
    user$.subscribe(x => console.log('User:', x));
  }

  // race returns the Observable that emits first and ignores the others.

  race_Operator() {
    const users$ = of('User1', 'User2');
    const orders$ = of('Order1', 'Order2');

    zip(users$, orders$)
      .subscribe(([user, order]) => {
        console.log(`${user} → ${order}`);
      });
  }

  // zip combines values from multiple Observables in pairs based on their index.

  zip_Operator() {
    zip(
      of('User1', 'User2'),
      of('Order1', 'Order2')
    ).subscribe(([user, order]) => {
      this.result.push(`${user} → ${order}`);
    });
  }

}

