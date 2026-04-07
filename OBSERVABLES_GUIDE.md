# Complete Guide to RxJS Observables & Real-Time Problem Solving

## Table of Contents
1. [Introduction to Observables](#introduction)
2. [Creation Operators](#creation-operators)
3. [Condition & Boolean Operators](#condition-operators)
4. [Join & Combination Operators](#join-operators)
5. [Math & Aggregation Operators](#math-operators)
6. [Multicasting Operators](#multicasting-operators)
7. [Real-Time Problem-Solving Examples](#real-time-problems)
8. [Best Practices](#best-practices)

---

## Introduction to Observables {#introduction}

### What is an Observable?

An **Observable** is a core concept in RxJS (Reactive Extensions for JavaScript). It represents a stream of data that flows over time. Think of it as a conveyor belt of values that can be processed as they arrive.

**Key Characteristics:**
- **Lazy Execution**: Observables don't execute until someone subscribes
- **Stream of Values**: Can emit zero, one, or many values over time
- **Time-Based**: Handles asynchronous operations naturally
- **Composable**: Multiple operators can be chained together
- **Cancellable**: Can be unsubscribed to stop listening

### Cold vs Hot Observables

**Cold Observable** (Default):
- Creates a new execution for each subscriber
- Each subscriber gets independent data
- Example: `of()`, `from()`, `interval()` (without sharing)

```typescript
const cold$ = of(1, 2, 3);
cold$.subscribe(x => console.log('Sub1:', x)); // Emits: 1, 2, 3
cold$.subscribe(x => console.log('Sub2:', x)); // Emits: 1, 2, 3 (Independent)
```

**Hot Observable**:
- Single execution shared among all subscribers
- New subscribers might miss earlier values
- Example: DOM events, `shareReplay()`

```typescript
const hot$ = of(1, 2, 3).pipe(share());
hot$.subscribe(x => console.log('Sub1:', x)); // Emits: 1, 2, 3
hot$.subscribe(x => console.log('Sub2:', x)); // Might miss values
```

---

## Creation Operators {#creation-operators}

Creation operators are used to create Observables from various data sources.

### 1. `of()` - Create Observable from Values

**What it does:** Emits each argument as a separate value and completes.

```typescript
of(1, 2, 3, 'Angular').subscribe(value => {
  console.log(value); // Outputs: 1, 2, 3, Angular
});
```

**Use Cases:**
- Creating test data
- Returning static values
- Converting single values to Observables

**Real-World Example:**
```typescript
// Loading a cached user synchronously
getUserFromCache(): Observable<User> {
  const user = this.cache.get('user');
  return user ? of(user) : throwError(() => new Error('Not found'));
}
```

---

### 2. `from()` - Convert Iterables to Observables

**What it does:** Converts arrays, promises, iterables into Observables. Each element becomes a separate emission.

```typescript
from([1, 2, 3]).subscribe(value => {
  console.log(value); // Outputs: 1, 2, 3
});

// Works with Promises too
from(Promise.resolve('Data')).subscribe(value => {
  console.log(value); // Outputs: Data
});
```

**Use Cases:**
- Converting arrays to streams
- Converting Promises to Observables
- Working with iterable data structures

**Real-World Example:**
```typescript
// Processing multiple API responses sequentially
processBatchData(ids: number[]): Observable<any> {
  return from(ids).pipe(
    concatMap(id => this.api.getData(id))
  );
}
```

---

### 3. `interval()` - Emit Values at Regular Intervals

**What it does:** Emits incremental numbers at specified intervals (in milliseconds).

```typescript
interval(1000).subscribe(x => {
  console.log('Seconds passed:', x);
  // Outputs every 1 second: 0, 1, 2, 3...
});
```

**Use Cases:**
- Polling API endpoints
- Creating heartbeat/keep-alive mechanisms
- Periodic UI updates
- Timeouts and countdowns

---

### 4. `timer()` - Emit After Delay

**What it does:** Waits for a specified delay, then emits values at intervals.

```typescript
// Emit once after 3 seconds
timer(3000).subscribe(() => console.log('Done!'));

// Emit 0 after 0ms, then numbers every 1 second
timer(0, 1000).subscribe(x => console.log(x));
```

**Use Cases:**
- Delayed actions
- Countdown timers
- Retry logic with delays

---

### 5. `defer()` - Lazy Observable Creation

**What it does:** Defers the creation of Observable until subscription time. Useful for creating fresh instances per subscriber.

```typescript
const lazy$ = defer(() => {
  console.log('Creating observable');
  return of(Math.random());
});

lazy$.subscribe(); // Logs "Creating observable"
lazy$.subscribe(); // Logs "Creating observable" again (new instance)
```

**Use Cases:**
- Creating fresh instances per subscriber
- Conditional Observable creation
- Resetting state per subscription

---

### 6. `iif()` - Conditional Observable Creation

**What it does:** Choose between two Observables based on a condition.

```typescript
iif(
  () => isLoggedIn(),
  of('Welcome back!'),
  of('Please log in')
).subscribe(console.log);
```

**Use Cases:**
- Feature flags
- Conditional logic based on authentication
- A/B testing in streams

---

### 7. `fromEvent()` - Listen to DOM Events

**What it does:** Converts DOM events into an Observable stream.

```typescript
// Listen to window scroll
fromEvent(window, 'scroll').subscribe(() => {
  console.log('User is scrolling');
});

// Listen to button clicks
fromEvent(buttonElement, 'click').subscribe(() => {
  console.log('Button clicked');
});

// Listen to input changes with debouncing
fromEvent(inputElement, 'keyup')
  .pipe(
    debounceTime(500),
    map((event: any) => event.target.value)
  )
  .subscribe(searchTerm => {
    this.performSearch(searchTerm);
  });
```

**Real-World Example - Search with Debounce:**
```typescript
// Problem: API calls fire on every keystroke (expensive!)
// Solution: Use debounceTime to wait for user to stop typing

ngAfterViewInit() {
  fromEvent(this.searchInput.nativeElement, 'keyup')
    .pipe(
      debounceTime(500),        // Wait 500ms after user stops typing
      map((e: any) => e.target.value),
      distinctUntilChanged(),   // Only if value actually changed
      switchMap(query => this.api.search(query))  // Cancel previous requests
    )
    .subscribe(results => {
      this.displayResults(results);
    });
}
```

---

## Condition & Boolean Operators {#condition-operators}

These operators evaluate conditions and return boolean results or filter values.

### 1. `defaultIfEmpty()` - Handle Empty Streams

**What it does:** Emits a default value if the source Observable completes without emitting anything.

```typescript
// Empty observable
of()
  .pipe(defaultIfEmpty('No Data'))
  .subscribe(console.log); // Outputs: No Data

// Normal observable
of(1, 2, 3)
  .pipe(defaultIfEmpty('No Data'))
  .subscribe(console.log); // Outputs: 1, 2, 3
```

**Real-World Example:**
```typescript
getUser(id: number) {
  return this.api.getUserById(id).pipe(
    defaultIfEmpty({ id: 0, name: 'Unknown User' })
  );
}
```

---

### 2. `every()` - Check All Values Match Condition

**What it does:** Checks if ALL emitted values satisfy a condition. Returns single boolean.

```typescript
from([2, 4, 6, 8])
  .pipe(every(x => x % 2 === 0))
  .subscribe(console.log); // Outputs: true

from([2, 4, 5, 8])
  .pipe(every(x => x % 2 === 0))
  .subscribe(console.log); // Outputs: false
```

**Real-World Example - Validation:**
```typescript
// Check if all form fields are valid
isFormValid(fields: FormControl[]) {
  return from(fields).pipe(
    every(field => field.valid),
    startWith(false)  // Initial state
  );
}
```

---

### 3. `find()` - Get First Matching Value

**What it does:** Returns the first value that matches a condition, then completes.

```typescript
from([10, 20, 30, 40])
  .pipe(find(x => x > 25))
  .subscribe(console.log); // Outputs: 30 (first value > 25)
```

**Real-World Example:**
```typescript
// Find user in array
findUserById(users: User[], id: number) {
  return from(users).pipe(
    find(user => user.id === id)
  );
}
```

---

### 4. `findIndex()` - Get Index of First Matching Value

**What it does:** Returns the index position of the first matching value.

```typescript
from([10, 20, 30, 40])
  .pipe(findIndex(x => x > 25))
  .subscribe(console.log); // Outputs: 2 (index of 30)
```

**Real-World Example:**
```typescript
// Find position of item in list
findItemPosition(items: Product[], productId: number) {
  return from(items).pipe(
    findIndex(item => item.id === productId)
  );
}
```

---

### 5. `isEmpty()` - Check if Stream is Empty

**What it does:** Returns true if Observable completes without emitting any value.

```typescript
of()
  .pipe(isEmpty())
  .subscribe(console.log); // Outputs: true

of(1, 2, 3)
  .pipe(isEmpty())
  .subscribe(console.log); // Outputs: false
```

**Real-World Example:**
```typescript
// Check if search returned results
checkSearchResults(query: string) {
  return this.api.search(query).pipe(
    isEmpty(),
    map(isEmpty => isEmpty ? 'No results found' : 'Results available')
  );
}
```

---

## Join & Combination Operators {#join-operators}

These operators combine multiple Observables.

### Higher-Level Join Operators

#### 1. `combineLatest()` - Always Latest Values

**What it does:** Emits the latest combination whenever ANY Observable emits.

```typescript
// Practical: Search and Category filters
const search$ = fromEvent(searchBox, 'keyup').pipe(
  debounceTime(300),
  map((e: any) => e.target.value)
);

const category$ = fromEvent(categorySelect, 'change').pipe(
  map((e: any) => e.target.value)
);

combineLatest([search$, category$])
  .subscribe(([searchTerm, category]) => {
    console.log(`Search: ${searchTerm}, Category: ${category}`);
    this.filterProducts(searchTerm, category);
  });
```

**Behavior:**
- Waits for all Observables to emit at least once
- Then emits whenever ANY of them emits
- Perfect for form filters and dependent inputs

**Real-World Example - Multi-Filter Search:**
```typescript
setupFilters() {
  const search$ = this.searchInput$.pipe(
    debounceTime(300),
    startWith('')
  );
  
  const category$ = this.category$.pipe(startWith('all'));
  const priceRange$ = this.priceRange$.pipe(startWith([0, 1000]));

  combineLatest([search$, category$, priceRange$])
    .subscribe(([search, category, [min, max]]) => {
      this.products$ = this.api.search({
        query: search,
        category,
        minPrice: min,
        maxPrice: max
      });
    });
}
```

---

#### 2. `concat()` - Sequential Execution

**What it does:** Executes Observables one after another. Waits for completion before starting next.

```typescript
const login$ = of('User logged in').pipe(delay(1000));
const profile$ = of('Profile loaded').pipe(delay(1000));

concat(login$, profile$)
  .subscribe(console.log);
// Outputs after 1s: "User logged in"
// Outputs after 2s: "Profile loaded"
```

**Use Cases:**
- Multi-step processes (login → load profile → sync data)
- Sequential API calls
- Step-by-step operations

**Real-World Example - Login Flow:**
```typescript
loginFlow() {
  return concat(
    this.authService.login(credentials).pipe(
      tap(token => this.saveToken(token))
    ),
    this.userService.loadProfile().pipe(
      tap(profile => this.saveProfile(profile))
    ),
    this.syncService.syncData().pipe(
      tap(() => console.log('Ready'))
    )
  );
}
```

---

#### 3. `forkJoin()` - Wait for All to Complete

**What it does:** Waits for ALL Observables to complete, then emits their LAST values together.

```typescript
forkJoin({
  users: ajax.getJSON('https://jsonplaceholder.typicode.com/users'),
  posts: ajax.getJSON('https://jsonplaceholder.typicode.com/posts')
}).subscribe(({ users, posts }) => {
  console.log('Users:', users);
  console.log('Posts:', posts);
});
```

**Key Difference from combineLatest:**
- combineLatest: Emits on EVERY change
- forkJoin: Emits ONCE when all complete

**Real-World Example - Parallel Data Loading:**
```typescript
loadDashboard() {
  return forkJoin({
    user: this.userService.getUser(),
    stats: this.analyticsService.getStats(),
    notifications: this.notificationService.get(),
    settings: this.settingsService.load()
  }).pipe(
    tap(({ user, stats, notifications, settings }) => {
      this.initializeUI(user, stats, notifications, settings);
    })
  );
}
```

---

#### 4. `merge()` - Combine Without Waiting

**What it does:** Combines Observables and emits values as they arrive (no waiting).

```typescript
const fast$ = interval(500).pipe(map(() => 'FAST'));
const slow$ = interval(1000).pipe(map(() => 'SLOW'));

merge(fast$, slow$)
  .subscribe(console.log);
// Outputs: FAST, SLOW, FAST, FAST, SLOW...
```

**Use Cases:**
- Multiple real-time data streams (user events, server updates)
- Combining user interactions
- Multi-source notifications

**Real-World Example - Activity Feed:**
```typescript
getActivityFeed() {
  return merge(
    this.userEvents$,           // User actions
    this.serverNotifications$,  // Real-time updates
    this.chatMessages$,         // Incoming messages
    this.systemAlerts$          // System notifications
  ).pipe(
    startWith([]),
    scan((acc, value) => [value, ...acc], [])  // Build activity list
  );
}
```

---

#### 5. `partition()` - Split Based on Condition

**What it does:** Splits one Observable into two: values matching and not matching a condition.

```typescript
const users$ = from([
  { name: 'A', role: 'admin' },
  { name: 'B', role: 'user' },
  { name: 'C', role: 'admin' }
]);

const [admins$, users$] = partition(
  users$,
  user => user.role === 'admin'
);

admins$.subscribe(admin => console.log('Admin:', admin));
users$.subscribe(user => console.log('User:', user));
```

**Real-World Example - Separate Valid/Invalid Data:**
```typescript
processFormData(data: any[]) {
  const [valid, invalid] = partition(
    from(data),
    item => this.validator.isValid(item)
  );

  valid.subscribe(data => this.api.save(data));
  invalid.subscribe(data => this.handleError(data));
}
```

---

### Lower-Level Join Operators (All-Operator Variants)

#### 1. `combineLatestAll()` - Dynamic Combination

When source emits Observables, combine their latest values.

```typescript
const source$ = of(
  of('User Data').pipe(delay(1000)),
  of('Orders Data').pipe(delay(2000))
);

source$
  .pipe(combineLatestAll())
  .subscribe(([user, orders]) => {
    console.log(user, orders);
  });
```

#### 2. `concatAll()` - Flatten Sequentially

Subscribes to inner Observables sequentially, one after another.

```typescript
of(
  of('Step 1').pipe(delay(1000)),
  of('Step 2').pipe(delay(1000)),
  of('Step 3').pipe(delay(1000))
)
  .pipe(concatAll())
  .subscribe(console.log);
// Outputs after 1s, 2s, 3s: Step 1, Step 2, Step 3
```

#### 3. `mergeAll()` - Flatten Concurrently

Subscribes to all inner Observables simultaneously.

```typescript
of(
  of('File1').pipe(delay(2000)),
  of('File2').pipe(delay(1000))
)
  .pipe(mergeAll())
  .subscribe(console.log);
// Outputs after 1s: File2
// Outputs after 2s: File1
```

#### 4. `switchAll()` - Switch to Latest

When a new inner Observable arrives, switches to it and cancels the previous one.

```typescript
fromEvent(searchInput, 'keyup')
  .pipe(
    debounceTime(300),
    map(event => this.api.search(event.target.value)),
    switchAll()  // Cancel previous request if new search starts
  )
  .subscribe(results => this.displayResults(results));
```

**Problem it Solves:** Race conditions in search/autocomplete
- User types "a" → API request starts
- User types "ab" → Previous request cancelled, new one starts
- Previous request completes → Ignored
- New request completes → Results shown

#### 5. `exhaustAll()` - Ignore While Busy

Ignores new Observables while currently processing one.

```typescript
fromEvent(submitBtn, 'click')
  .pipe(
    map(() => this.api.submitForm()),
    exhaustAll()  // Ignore clicks while submission is ongoing
  )
  .subscribe(result => this.showSuccess(result));
```

**Problem it Solves:** Prevents form double-submission
- User clicks "Submit"
- API request starts (takes 2 seconds)
- User clicks again immediately → Ignored
- First request completes → Only one response

---

## Math & Aggregation Operators {#math-operators}

These operators perform calculations on emitted values.

### 1. `count()` - Count Total Emissions

**What it does:** Counts total number of values emitted and returns count on completion.

```typescript
from([10, 20, 30, 40])
  .pipe(count())
  .subscribe(res => console.log('Count:', res)); // Outputs: 4
```

**Real-World Example:**
```typescript
countDownloadedItems(files: File[]) {
  return from(files).pipe(
    filter(f => f.downloaded),
    count()
  );
}
```

---

### 2. `max()` - Find Maximum Value

**What it does:** Finds and returns the maximum value on completion.

```typescript
from([5, 15, 10, 25])
  .pipe(max())
  .subscribe(res => console.log('Max:', res)); // Outputs: 25
```

**Real-World Example:**
```typescript
getHighestScore(gameScores: number[]) {
  return from(gameScores).pipe(max());
}
```

---

### 3. `min()` - Find Minimum Value

**What it does:** Finds and returns the minimum value on completion.

```typescript
from([5, 15, 10, 2])
  .pipe(min())
  .subscribe(res => console.log('Min:', res)); // Outputs: 2
```

**Real-World Example:**
```typescript
getLowestPrice(prices: Product[]) {
  return from(prices).pipe(
    map(p => p.price),
    min()
  );
}
```

---

### 4. `reduce()` - Aggregate Values

**What it does:** Accumulates values using an accumulator function, returns final result on completion.

```typescript
from([10, 20, 30])
  .pipe(
    reduce((acc, value) => acc + value, 0)
  )
  .subscribe(res => console.log('Sum:', res)); // Outputs: 60
```

**Real-World Examples:**

```typescript
// Calculate total order amount
calculateOrderTotal(items: OrderItem[]) {
  return from(items).pipe(
    reduce((total, item) => total + (item.price * item.quantity), 0)
  );
}

// Build user permissions object
getUserPermissions(roles: Role[]) {
  return from(roles).pipe(
    reduce((permissions, role) => ({
      ...permissions,
      ...role.permissions
    }), {})
  );
}

// Count occurrences of each item
countOccurrences(items: string[]) {
  return from(items).pipe(
    reduce((acc, item) => ({
      ...acc,
      [item]: (acc[item] || 0) + 1
    }), {})
  );
}
```

---

## Multicasting Operators {#multicasting-operators}

These operators allow multiple subscribers to share a single execution.

### The Problem: Cold Observables Create Duplicate Executions

```typescript
const request$ = this.http.get('/api/data');

// BAD: Makes 2 API requests!
request$.subscribe(data => console.log('Sub1:', data));
request$.subscribe(data => console.log('Sub2:', data));
```

### Solution: Multicasting Operators

#### 1. `share()` - Share Single Execution

**What it does:** Converts a cold Observable to hot, sharing one execution among all subscribers.

```typescript
// Multicasting with share()
const request$ = this.http.get('/api/data').pipe(
  share()
);

// Makes ONLY 1 API request!
request$.subscribe(data => console.log('Sub1:', data));
request$.subscribe(data => console.log('Sub2:', data));
```

**Real-World Example:**
```typescript
loadUserData() {
  const userData$ = this.api.getUser().pipe(share());
  
  // Multiple components can subscribe without duplicate requests
  this.profileComponent.data$ = userData$;
  this.sidebarComponent.user$ = userData$;
  this.headerComponent.user$ = userData$;
}
```

---

#### 2. `shareReplay()` - Share with Caching

**What it does:** Shares execution AND caches emitted values for late subscribers.

```typescript
const users$ = this.http.get('/api/users').pipe(
  shareReplay({ bufferSize: 1, refCount: true })
);

users$.subscribe(users => console.log('Sub1 received:', users));

setTimeout(() => {
  // Late subscriber gets cached value immediately!
  users$.subscribe(users => console.log('Sub2 received:', users));
}, 5000);
```

**Key Options:**
- `bufferSize`: How many values to cache (usually 1)
- `refCount`: Auto-unsubscribe when last subscriber leaves

**Real-World Example - Cached API Data:**
```typescript
private users$ = new Observable<User[]>();

getUsers(): Observable<User[]> {
  if (!this.users$) {
    this.users$ = this.http.get<User[]>('/api/users').pipe(
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }
  return this.users$;
}

// Multiple components can call getUsers() without duplicating requests
// First call: Makes API request
// Subsequent calls within refCount time: Use cached data
// All subscriptions cleared: Data cleared from cache
```

---

### Real-World Example: Search Service with Caching

```typescript
@Injectable()
export class SearchService {
  private searchCache = new Map<string, Observable<SearchResult[]>>();

  search(query: string): Observable<SearchResult[]> {
    // Return cached result if available
    if (this.searchCache.has(query)) {
      return this.searchCache.get(query)!;
    }

    // Otherwise fetch and cache
    const result$ = this.api.search(query).pipe(
      shareReplay({ bufferSize: 1, refCount: true })
    );

    this.searchCache.set(query, result$);
    return result$;
  }
}
```

---

## Real-Time Problem-Solving Examples {#real-time-problems}

### Problem 1: Search with Debounce & Cancellation

**Scenario:** User types in search box. Need to:
- Wait until user stops typing (debounce)
- Make only ONE API request for each search term
- Cancel previous request if user types again

```typescript
export class ProductSearchComponent {
  @ViewChild('searchInput') searchInput!: ElementRef;
  searchResults$ = new Observable<Product[]>();

  ngAfterViewInit() {
    this.searchResults$ = fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(
        map((event: any) => event.target.value),
        debounceTime(500),              // Wait 500ms after typing stops
        distinctUntilChanged(),          // Skip if same value as before
        switchMap(query => {
          if (!query.trim()) {
            return of([]);              // Empty results if no query
          }
          return this.api.searchProducts(query);
        }),
        startWith([]),                  // Initial empty state
        shareReplay(1)                  // Cache last result
      );
  }
}
```

**How it works:**
1. User types "phone" → Each keystroke triggers
2. debounceTime waits 500ms for typing to stop
3. switchMap cancels previous request and makes new one
4. Results shared among all subscribers

---

### Problem 2: Form Validation with Multiple Conditions

**Scenario:** Enable submit button based on multiple form conditions:
- All fields filled
- Email is valid
- Password strong enough

```typescript
export class RegistrationFormComponent {
  form!: FormGroup;
  isFormValid$!: Observable<boolean>;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    });
  }

  ngOnInit() {
    this.isFormValid$ = combineLatest([
      this.form.statusChanges.pipe(startWith(this.form.status)),
      this.form.get('password')!.valueChanges.pipe(
        startWith(''),
        map(pwd => this.isStrongPassword(pwd))
      ),
      this.form.get('confirmPassword')!.valueChanges.pipe(
        startWith(''),
        map(confirm => confirm === this.form.get('password')?.value)
      )
    ]).pipe(
      map(([status, isStong, passwordsMatch]) => {
        return status === 'VALID' && isStong && passwordsMatch;
      })
    );
  }

  isStrongPassword(pwd: string): boolean {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(pwd);
  }
}
```

**Template:**
```html
<button [disabled]="(isFormValid$ | async) === false">
  Register
</button>
```

---

### Problem 3: Real-Time Data with Retry Logic

**Scenario:** Load dashboard data with automatic retries on failure.

```typescript
export class DashboardComponent {
  dashboardData$ = this.loadDashboard();

  constructor(private api: ApiService) {}

  loadDashboard() {
    return this.api.getDashboardData().pipe(
      retryWhen(errors =>
        errors.pipe(
          concatMap((error, index) => {
            if (index >= 3) {  // Max 3 retries
              return throwError(() => error);
            }
            const delayMs = Math.pow(2, index) * 1000;  // Exponential backoff
            console.log(`Retrying after ${delayMs}ms...`);
            return timer(delayMs);
          })
        )
      ),
      catchError(error => {
        console.error('Dashboard data failed:', error);
        return of(this.getDefaultDashboard());
      })
    );
  }

  getDefaultDashboard() {
    return {
      cards: [],
      widgets: [],
      message: 'Using cached/default data'
    };
  }
}
```

---

### Problem 4: Multi-Step File Upload with Progress

**Scenario:** Upload files with:
- Progress tracking
- Parallel uploads (but max 3 at a time)
- Proper error handling

```typescript
export class FileUploadComponent {
  uploadProgress$ = new Subject<UploadProgress>();

  uploadFiles(files: File[]) {
    return from(files).pipe(
      mergeMap(
        file => this.uploadFile(file),
        3  // Max 3 concurrent uploads
      ),
      scan((acc, progress) => [...acc, progress], [] as UploadProgress[]),
      shareReplay(1)
    );
  }

  private uploadFile(file: File): Observable<UploadProgress> {
    return this.api.uploadFile(file).pipe(
      map(event => ({
        name: file.name,
        progress: Math.round(100 * event.loaded / event.total),
        status: event.type === HttpEventType.Response ? 'complete' : 'uploading'
      })),
      catchError(error => {
        this.showError(`Failed to upload ${file.name}`);
        return of({
          name: file.name,
          progress: 0,
          status: 'error'
        });
      })
    );
  }
}
```

---

### Problem 5: Real-Time Notifications with Unread Badge

**Scenario:** Show notification badge with count, update in real-time.

```typescript
@Injectable()
export class NotificationService {
  private notifications$ = this.socket.notifications$.pipe(
    shareReplay(1)
  );

  unreadCount$ = this.notifications$.pipe(
    scan((prev, notification) => {
      if (!notification.read) {
        return prev + 1;
      }
      return prev;
    }, 0),
    startWith(0),
    distinctUntilChanged()
  );

  markAsRead(notificationId: number) {
    return this.api.markNotificationRead(notificationId).pipe(
      tap(() => {
        this.unreadCount$ = this.unreadCount$.pipe(
          map(count => Math.max(0, count - 1))
        );
      })
    );
  }
}

// In component
export class NotificationBadgeComponent {
  unreadCount$ = this.notificationService.unreadCount$;

  constructor(private notificationService: NotificationService) {}
}
```

**Template:**
```html
<span class="badge" *ngIf="(unreadCount$ | async) as count">
  {{ count }}
</span>
```

---

### Problem 6: Polling with Smart Backoff

**Scenario:** Poll API for status updates, but reduce polling frequency when nothing changes.

```typescript
export class TaskStatusComponent {
  taskStatus$ = this.pollTaskStatus();

  constructor(private api: ApiService) {}

  pollTaskStatus() {
    return interval(2000).pipe(
      switchMap(() => this.api.getTaskStatus()),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
      tap(status => {
        if (status.complete) {
          console.log('Task complete, stopping poll');
          // Automatically stops because stream completes
        }
      }),
      takeUntil(this.destroy$)
    );
  }
}
```

---

### Problem 7: Coordinated Multi-Step Process

**Scenario:** 
1. Fetch user data
2. Based on user, fetch their preferences
3. Based on preferences, fetch settings
4. Show everything together

```typescript
loadUserWithPreferences(userId: number) {
  return this.api.getUser(userId).pipe(
    switchMap(user =>
      combineLatest([
        of(user),
        this.api.getUserPreferences(user.id),
        this.api.getUserSettings(user.id)
      ])
    ),
    map(([user, preferences, settings]) => ({
      user,
      preferences,
      settings
    })),
    tap(data => console.log('All data loaded:', data))
  );
}

// Usage in component:
userData$ = this.loadUserWithPreferences(123);

// Template:
<ng-container *ngIf="userData$ | async as data">
  <h1>{{ data.user.name }}</h1>
  <p>Language: {{ data.preferences.language }}</p>
  <p>Theme: {{ data.settings.theme }}</p>
</ng-container>
```

---

## Best Practices {#best-practices}

### 1. **Unsubscribe Properly**

```typescript
// BAD: Memory leak
ngOnInit() {
  this.data$.subscribe(data => this.data = data);
}

// GOOD: Using async pipe (auto unsubscribes)
data$ = this.api.getData();
// In template: {{ data$ | async }}

// GOOD: Using takeUntil
private destroy$ = new Subject<void>();

ngOnInit() {
  this.data$
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => this.data = data);
}

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}

// GOOD: Using takeUntilDestroyed (Angular 16+)
data$ = this.api.getData().pipe(
  takeUntilDestroyed(this.destroyRef)
);

constructor(private destroyRef: DestroyRef) {}
```

---

### 2. **Use Async Pipe When Possible**

```typescript
// BAD: Manual subscription management
dataToShow: Data | null = null;

ngOnInit() {
  this.data$.subscribe(data => this.dataToShow = data);
}

ngOnDestroy() {
  this.subscription.unsubscribe();
}

// GOOD: Let async pipe handle it
data$ = this.api.getData();
```

```html
<!-- Template -->
<div *ngIf="data$ | async as data">
  {{ data.name }}
</div>
```

---

### 3. **Avoid Nested Subscriptions (Pyramid of Doom)**

```typescript
// BAD: Nested subscriptions
getUserData(userId: number) {
  this.api.getUser(userId).subscribe(user => {
    this.api.getOrders(user.id).subscribe(orders => {
      this.api.getStats(user.id).subscribe(stats => {
        console.log(user, orders, stats);
      });
    });
  });
}

// GOOD: Use flatMap operators
getUserData(userId: number) {
  return this.api.getUser(userId).pipe(
    switchMap(user =>
      combineLatest([
        of(user),
        this.api.getOrders(user.id),
        this.api.getStats(user.id)
      ])
    ),
    map(([user, orders, stats]) => ({ user, orders, stats }))
  );
}
```

---

### 4. **Use Proper Flattening Operators**

| Operator | Best For |
|----------|----------|
| **switchMap** | Latest value (search, filters) |
| **mergeMap** | Parallel processing (uploads) |
| **concatMap** | Sequential processing (form steps) |
| **exhaustMap** | Single operation (button clicks) |

```typescript
// Search - Use switchMap
search$.pipe(
  switchMap(query => this.api.search(query))
)

// File uploads - Use mergeMap
files$.pipe(
  mergeMap(file => this.api.upload(file), 3)  // 3 concurrent
)

// Multi-step process - Use concatMap
steps$.pipe(
  concatMap(step => this.executeStep(step))
)

// Form submission - Use exhaustMap
submitBtn$.pipe(
  exhaustMap(() => this.api.submit())  // Ignore multiple clicks
)
```

---

### 5. **Proper Error Handling**

```typescript
// BAD: Breaks entire stream
request$.subscribe(
  data => console.log(data),
  error => console.log('Error')  // Stream stops here
);

// GOOD: Use catchError to recover
request$.pipe(
  catchError(error => {
    console.log('Error:', error);
    return of(defaultData);  // Continue stream
  })
).subscribe(data => console.log(data));

// GOOD: Retry with backoff
request$.pipe(
  retryWhen(errors =>
    errors.pipe(
      concatMap((error, index) => {
        if (index >= 3) return throwError(() => error);
        return timer(Math.pow(2, index) * 1000);
      })
    )
  ),
  catchError(() => of(defaultData))
).subscribe();
```

---

### 6. **Share When Appropriate**

```typescript
// Problem: Multiple API calls
getUsers() {
  const users$ = this.http.get('/users');
  component1.data = users$;
  component2.data = users$;
  // Makes 2 API calls!
}

// Solution: Use share/shareReplay
getUsers() {
  const users$ = this.http.get('/users').pipe(
    shareReplay({ bufferSize: 1, refCount: true })
  );
  component1.data = users$;
  component2.data = users$;
  // Makes 1 API call!
}
```

---

### 7. **Performance: Use OnPush Change Detection**

```typescript
@Component({
  selector: 'app-data',
  template: `{{ data$ | async }}`,
  changeDetection: ChangeDetectionStrategy.OnPush  // Only check when inputs change
})
export class DataComponent {
  @Input() data$!: Observable<Data>;
}
```

---

### 8. **Operators Takeaway Checklist**

```
Creation
├─ of() - Single/multiple static values
├─ from() - Convert array/promise
├─ timer() - Initial delay
├─ interval() - Repeating emissions
├─ fromEvent() - DOM events
├─ defer() - Lazy creation
└─ iif() - Conditional

Conditions
├─ filter() - Keep matching values
├─ find() - First match
├─ every() - All match?
├─ isEmpty() - No values?
└─ defaultIfEmpty() - Fallback value

Combination
├─ combineLatest() - Multi-source, latest values
├─ merge() - Multi-source, any order
├─ concat() - Sequential
├─ forkJoin() - All complete
└─ partition() - Split by condition

Flattening
├─ switchMap() - Latest request
├─ mergeMap() - Parallel
├─ concatMap() - Sequential
└─ exhaustMap() - Ignore while busy

Aggregation
├─ reduce() - Accumulate
├─ scan() - Running aggregate
└─ count() - Total count

Caching
├─ share() - Single execution
└─ shareReplay() - With caching

Timing
├─ debounceTime() - Wait for pause
├─ throttleTime() - Sample periodically
└─ distinctUntilChanged() - Skip repeats
```

---

## Summary

Observables are powerful for handling asynchronous operations. Key takeaways:

1. **Creation**: Understand different sources (events, timers, promises, etc.)
2. **Combination**: Merge multiple streams intelligently (combineLatest, merge, concat)
3. **Transformation**: Transform values through the pipeline (map, switchMap, etc.)
4. **Aggregation**: Combine values into results (reduce, count, etc.)
5. **Best Practices**: Unsubscribe, use async pipe, avoid nesting, handle errors properly

The examples in your code demonstrate all these concepts. Practice combining them to solve real-world problems!

