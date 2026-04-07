import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEvent, interval, Observable, share, shareReplay, take } from 'rxjs';
import { Api } from '../../../services/api';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-multicasting',
  imports: [CommonModule],
  templateUrl: './multicasting.html',
  styleUrl: './multicasting.scss',
})
export class Multicasting implements OnInit {

  @ViewChild('btn') btn!: ElementRef;
  users$!: Observable<any>;

  constructor(
    private dataService: Api,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.share_Operators();
    this.share_API_Operators();
    this.getUsers();
    this.connectable();
  }

  // share converts a cold Observable into a hot Observable and shares a single execution among multiple subscribers.

  ngAfterViewInit() {
    const click$ = fromEvent(this.btn.nativeElement, 'click')
      .pipe(share());

    click$.subscribe(() => console.log('Handler 1'));
    click$.subscribe(() => console.log('Handler 2'));
  }

  share_Operators() {
    const source$ = interval(1000).pipe(
      take(3),
      share()
    );

    source$.subscribe(x => console.log('Sub1:', x));
    source$.subscribe(x => console.log('Sub2:', x));
  }

  share_API_Operators() {
    const data$ = this.dataService.getData();
    data$.subscribe(res => console.log('Comp1', res));
    data$.subscribe(res => console.log('Comp2', res));
  }

  // shareReplay is used to share a single execution and cache emitted values so that new subscribers can receive previous
  // data without re-executing the source.

  getUsers() {
    if (!this.users$) {
      this.users$ = this.http.get('https://jsonplaceholder.typicode.com/users')
        .pipe(
          shareReplay({ bufferSize: 1, refCount: true })
        );
    }
    return this.users$;
  }

  // connectable is an RxJS operator that converts a cold Observable into a connectable (hot) Observable, which starts emitting 
  // values only when connect() is explicitly called.

  connectable() {
    const source$ = interval(1000).pipe(take(3));
    const connectable$ = source$.pipe(share());
    connectable$.subscribe(x => console.log('Sub1:', x));
    connectable$.subscribe(x => console.log('Sub2:', x));
   // connectable$.connect(); // Uncomment to start emitting values
  }

  // ===== REAL-WORLD EXAMPLES =====

  // Example 1: Cache User Data - Prevent Duplicate API Calls
  // private userCache = new Map<number, Observable<User>>();
  //
  // getUserById(id: number): Observable<User> {
  //   if (!this.userCache.has(id)) {
  //     this.userCache.set(
  //       id,
  //       this.http.get<User>(`/api/users/${id}`).pipe(
  //         shareReplay({ bufferSize: 1, refCount: true })
  //       )
  //     );
  //   }
  //   return this.userCache.get(id)!;
  // }
  // 
  // // Usage: 3 components call but only 1 API request
  // // this.userService.getUserById(1);  // API call
  // // this.userService.getUserById(1);  // Cached
  // // this.userService.getUserById(1);  // Cached
  // }

  // Example 2: Search Cache Service
  // private searchCache = new Map<string, Observable<SearchResult[]>>();
  //
  // search(query: string): Observable<SearchResult[]> {
  //   if (this.searchCache.has(query)) {
  //     return this.searchCache.get(query)!;
  //   }
  //   const result$ = this.api.search(query).pipe(
  //     shareReplay({ bufferSize: 1, refCount: true })
  //   );
  //   this.searchCache.set(query, result$);
  //   return result$;
  // }

  // Example 3: Share Button Clicks Among Multiple Handlers
  // setupClickSharing() {
  //   const click$ = fromEvent(this.submitBtn, 'click').pipe(
  //     share()
  //   );
  //
  //   // Handler 1: Show loading
  //   click$.subscribe(() => this.showLoading());
  //
  //   // Handler 2: Disable button
  //   click$.subscribe(() => this.disableButton());
  //
  //   // Handler 3: Submit form
  //   click$.subscribe(() => this.submitForm());
  //   // All share same click event!
  // }

  // Example 4: Global Notification Service with Caching
  // getNotifications(): Observable<Notification[]> {
  //   if (!this.notifications$) {
  //     this.notifications$ = this.api.getNotifications().pipe(
  //       shareReplay({ bufferSize: 1, refCount: true })
  //     );
  //   }
  //   return this.notifications$;
  // }
  // // Multiple components subscribe without duplicate requests

  // Example 5: Real-Time Data Stream (No Caching Needed)
  // getRealtimeData(): Observable<any> {
  //   return this.websocket.connect('/api/realtime')
  //     .pipe(
  //       share()  // Share same socket connection
  //     );
  // }

}
