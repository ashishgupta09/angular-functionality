# RxJS Quick Cheat Sheet - Real-Time Problem Solutions

Quick reference for common Angular/RxJS scenarios and solutions.

---

## Problem: Search Box Debounce

**The Issue:** API gets called on every keystroke (bad performance)

```typescript
// ❌ WRONG - Calls API 100 times for 100 keystrokes
fromEvent(searchInput, 'keyup')
  .subscribe(event => {
    this.search(event.target.value);  // Called immediately!
  });

// ✅ CORRECT - Calls API once after user stops typing
fromEvent(searchInput, 'keyup')
  .pipe(
    debounceTime(300),                // Wait 300ms after last keystroke
    map((e: any) => e.target.value),
    distinctUntilChanged(),            // Skip if value didn't change
    switchMap(query => this.api.search(query))
  )
  .subscribe(results => this.showResults(results));
```

**Key Points:**
- `debounceTime(300)` - Waits 300ms for typing to stop
- `distinctUntilChanged()` - Prevents duplicate API calls
- `switchMap()` - Cancels previous request if new search starts

---

## Problem: Dependent Filters

**The Issue:** Need to filter by multiple criteria that depend on each other

```typescript
// ✅ Use combineLatest
const search$ = fromEvent(searchBox, 'keyup').pipe(
  debounceTime(300),
  map((e: any) => e.target.value),
  startWith('')
);

const category$ = fromEvent(categorySelect, 'change').pipe(
  map((e: any) => e.target.value),
  startWith('all')
);

const sort$ = fromEvent(sortSelect, 'change').pipe(
  map((e: any) => e.target.value),
  startWith('name')
);

combineLatest([search$, category$, sort$])
  .subscribe(([search, category, sort]) => {
    console.log(`Search: ${search}, Category: ${category}, Sort: ${sort}`);
    this.filterProducts(search, category, sort);
  });
```

**When to use combineLatest:**
- Form with multiple filters
- Dashboard with multiple inputs
- Any scenario needing latest from multiple sources

---

## Problem: Form Submission - Prevent Double Click

**The Issue:** User clicks submit, then clicks again before API responds

```typescript
// ❌ WRONG - Could submit twice
form.submit
  .subscribe(() => {
    this.api.submit(data).subscribe({
      next: () => this.showSuccess(),
      error: () => this.showError()
    });
  });

// ✅ CORRECT - Only processes first click
fromEvent(submitBtn, 'click')
  .pipe(
    exhaustMap(() => this.api.submit(data))
    // Ignores clicks while submission is in progress
  )
  .subscribe(() => this.showSuccess());
```

**Key Points:**
- `exhaustMap()` ignores subsequent clicks during submission
- Perfect for preventing double-submission
- Alternative: Disable button while submitting

---

## Problem: Load Multiple API Calls and Show All Together

**The Issue:** Need user data, posts, and comments before showing dashboard

```typescript
// ❌ WRONG - Nested subscriptions (pyramid of doom)
this.api.getUser().subscribe(user => {
  this.api.getPosts(user.id).subscribe(posts => {
    this.api.getComments(user.id).subscribe(comments => {
      // Finally have all data
      this.showDashboard(user, posts, comments);
    });
  });
});

// ✅ CORRECT - Use forkJoin
forkJoin({
  user: this.api.getUser(),
  posts: this.api.getPosts(userId),
  comments: this.api.getComments(userId)
}).subscribe(
  ({ user, posts, comments }) => {
    this.showDashboard(user, posts, comments);
  },
  error => this.showError(error)
);

// ✅ EVEN BETTER - Use switchMap for dependent calls
this.api.getUser().pipe(
  switchMap(user =>
    forkJoin({
      user: of(user),
      posts: this.api.getPosts(user.id),
      comments: this.api.getComments(user.id)
    })
  )
).subscribe(({ user, posts, comments }) => {
  this.showDashboard(user, posts, comments);
});
```

**Key Points:**
- `forkJoin()` waits for ALL to complete
- Returns only FINAL values from each
- Fails if ANY Observable errors (use `catchError()` to handle)

---

## Problem: Sequential Operations (Multi-Step Process)

**The Issue:** Need to complete steps in order (login → load profile → sync)

```typescript
// ❌ WRONG - Tries all at once
this.api.login(user)
  .pipe(
    switchMap(() => this.api.loadProfile()),
    switchMap(() => this.api.syncData())
  )
  // Problem: Doesn't wait for previous to complete

// ✅ CORRECT - Use concat
concat(
  this.api.login(user).pipe(
    tap(token => this.saveToken(token)),
    take(1)  // Important: Prevent infinite emission
  ),
  this.api.loadProfile().pipe(
    tap(profile => this.saveProfile(profile)),
    take(1)
  ),
  this.api.syncData().pipe(take(1))
)
  .subscribe(
    () => console.log('Step done'),
    err => this.showError(err),
    () => console.log('All steps complete')
  );
```

**Key Points:**
- `concat()` executes ONE at a time
- Waits for previous to COMPLETE before starting next
- Use `take(1)` to ensure Observable completes

---

## Problem: Timeout - Cancel if Takes Too Long

**The Issue:** API call hangs, need to timeout after 5 seconds

```typescript
// ✅ Use timeout()
this.api.getData()
  .pipe(
    timeout(5000),  // Cancel if takes > 5 seconds
    catchError(err => {
      if (err.name === 'TimeoutError') {
        return of(defaultData);  // Use cached data instead
      }
      throw err;
    })
  )
  .subscribe(data => this.displayData(data));
```

---

## Problem: Retry on Error

**The Issue:** API fails sometimes, need to retry automatically

```typescript
// ✅ Simple retry
this.api.getData()
  .pipe(
    retry(3)  // Retry up to 3 times
  )
  .subscribe(
    data => this.showData(data),
    err => this.showError('Failed after 3 retries')
  );

// ✅ Retry with delay (exponential backoff)
this.api.getData()
  .pipe(
    retryWhen(errors =>
      errors.pipe(
        concatMap((error, index) => {
          if (index >= 3) {  // Max 3 retries
            return throwError(() => error);  // Give up
          }
          const delayMs = Math.pow(2, index) * 1000;  // 1s, 2s, 4s
          console.log(`Retry attempt ${index + 1} after ${delayMs}ms`);
          return timer(delayMs);
        })
      )
    ),
    catchError(err => {
      this.showError('Failed after retries');
      return of([]);  // Show empty state
    })
  )
  .subscribe(data => this.showData(data));
```

**Common Delays:**
- Simple: `1000` ms (1 second)
- Linear: `index * 1000` (1s, 2s, 3s, ...)
- Exponential: `Math.pow(2, index) * 1000` (1s, 2s, 4s, 8s, ...)

---

## Problem: API Call Caching

**The Issue:** Multiple components call same API, causing duplicate requests

```typescript
// ❌ WRONG - Multiple requests
getUser(id: number) {
  return this.http.get(`/api/users/${id}`);
  // Each call makes new request!
}

// ✅ CORRECT - Cache with shareReplay
private userCache = new Map<number, Observable<User>>();

getUser(id: number): Observable<User> {
  if (!this.userCache.has(id)) {
    this.userCache.set(
      id,
      this.http.get<User>(`/api/users/${id}`).pipe(
        shareReplay({ bufferSize: 1, refCount: true })
      )
    );
  }
  return this.userCache.get(id)!;
}

// Usage: Calls API only once
this.users = [
  this.userService.getUser(1),  // API call
  this.userService.getUser(1),  // Cached
  this.userService.getUser(1)   // Cached
];
```

**shareReplay Options:**
- `bufferSize: 1` - Cache most recent value
- `refCount: true` - Auto-clear when no subscribers

---

## Problem: Unsubscribe on Component Destroy

**The Issue:** Memory leak - Observable continues even after component destroyed

```typescript
// ❌ WRONG - Never unsubscribes
ngOnInit() {
  this.data$.subscribe(data => this.data = data);
  // Subscription continues forever!
}

// ✅ CORRECT - Use async pipe (auto unsubscribe)
data$ = this.api.getData();
// In template: {{ data$ | async }}
// Automatically unsubscribes when component destroyed

// ✅ CORRECT - Manual unsubscribe with takeUntil
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

// ✅ CORRECT - Angular 16+ takeUntilDestroyed
data$ = this.api.getData().pipe(
  takeUntilDestroyed(this.destroyRef)
);

constructor(private destroyRef: DestroyRef) {}
```

**Best Practice:** Use async pipe whenever possible (auto-unsubscribe)

---

## Problem: Polling (Check for Updates Every N Seconds)

**The Issue:** Need to check for updates periodically

```typescript
// ✅ Simple polling
interval(5000)  // Check every 5 seconds
  .pipe(
    switchMap(() => this.api.checkForUpdates()),
    map(update => update.count),
    distinctUntilChanged(),
    takeUntil(this.destroy$)
  )
  .subscribe(count => {
    this.hasUpdates = count > 0;
  });

// ✅ Smart polling - stop when data changes
polledData$ = interval(5000).pipe(
  switchMap(() => this.api.getData()),
  distinctUntilChanged((prev, curr) => 
    JSON.stringify(prev) === JSON.stringify(curr)
  ),
  shareReplay(1),
  takeUntil(this.destroy$)
);
```

---

## Problem: Wait for Multiple Conditions Before Action

**The Issue:** Only enable button when all conditions met (form valid + data loaded)

```typescript
// ✅ Use combineLatest
isFormValid$ = this.form.statusChanges.pipe(
  map(() => this.form.valid),
  startWith(false)
);

isDataLoaded$ = this.api.loadData().pipe(
  map(() => true),
  startWith(false)
);

userAgreedToTerms$ = fromEvent(this.termsCheckbox, 'change').pipe(
  map((e: any) => e.target.checked),
  startWith(false)
);

canSubmit$ = combineLatest([
  isFormValid$,
  isDataLoaded$,
  userAgreedToTerms$
]).pipe(
  map(([formValid, dataLoaded, agreedToTerms]) => 
    formValid && dataLoaded && agreedToTerms
  )
);

// Template:
<button [disabled]="!(canSubmit$ | async)">Submit</button>
```

---

## Problem: Error Handling with User Feedback

**The Issue:** Show proper error messages to user

```typescript
// ✅ Complete error handling
getData$ = this.api.getData().pipe(
  retry(2),  // Retry twice first
  tap({
    next: (data) => {
      this.errorMessage = null;  // Clear previous errors
    },
    error: (err) => {
      if (err.status === 404) {
        this.errorMessage = 'Data not found';
      } else if (err.status === 500) {
        this.errorMessage = 'Server error. Please try again later';
      } else {
        this.errorMessage = 'Something went wrong';
      }
    }
  }),
  catchError(err => {
    console.error('Error:', err);
    return of([]);  // Return empty array on error
  })
);
```

---

## Problem: Trigger Action Based on Route Change

**The Issue:** Reload data when user navigates to different page

```typescript
data$ = this.route.params.pipe(
  switchMap(params => 
    this.api.getData(params.id)
  )
);

// Automatically reloads when route changes!
```

---

## Problem: Form Auto-Save

**The Issue:** Save form as user types (without spamming API)

```typescript
// ✅ Debounce + distinct + save
this.form.valueChanges
  .pipe(
    debounceTime(1000),              // Wait 1s after user stops
    distinctUntilChanged((prev, curr) =>
      JSON.stringify(prev) === JSON.stringify(curr)
    ),                                // Skip if nothing changed
    switchMap(data => this.api.save(data)),
    tap(() => this.showSaved()),
    catchError(err => {
      this.showError('Failed to save');
      return of(null);
    })
  )
  .subscribe();
```

---

## Problem: Combine Array Elements into Single Observable

**The Issue:** Have array of items, need to process sequentially

```typescript
// ❌ WRONG
for (let item of items) {
  this.api.process(item).subscribe(...);
}

// ✅ CORRECT
from(items).pipe(
  concatMap(item => this.api.process(item))  // Sequential
).subscribe(
  result => this.results.push(result),
  err => this.showError(err),
  () => this.showComplete()
);

// ✅ PARALLEL (up to 3 at a time)
from(items).pipe(
  mergeMap(
    item => this.api.process(item),
    3  // Max 3 concurrent
  )
).subscribe(
  result => this.results.push(result),
  err => this.showError(err),
  () => this.showComplete()
);
```

---

## Problem: Upload Multiple Files

**The Issue:** Upload files in parallel, show progress for each

```typescript
// ✅ Upload with progress tracking
uploadFiles(files: File[]) {
  return from(files).pipe(
    mergeMap(
      file => this.uploadFile(file),
      3  // Max 3 concurrent uploads
    ),
    scan((acc, progress) => [...acc, progress], []),
    shareReplay(1)
  );
}

private uploadFile(file: File) {
  return this.api.uploadFile(file).pipe(
    map(event => ({
      filename: file.name,
      progress: Math.round(100 * event.loaded / event.total)
    })),
    catchError(err => {
      return of({
        filename: file.name,
        progress: 0,
        error: true
      });
    })
  );
}

// Template:
<div *ngFor="let upload of (uploadProgress$ | async)">
  {{ upload.filename }}: {{ upload.progress }}%
</div>
```

---

## Problem: Search with Autocomplete Suggestions

**The Issue:** Show suggestions as user types, cancel if user stops typing quickly

```typescript
// ✅ Autocomplete with smart cancel
query$ = fromEvent(searchInput, 'input').pipe(
  map((e: any) => e.target.value),
  debounceTime(300),           // Wait for user to pause
  distinctUntilChanged(),       // Skip if same query
  filter(query => query.length > 2),  // Minimum 2 chars
  switchMap(query =>
    this.api.getSuggestions(query).pipe(
      timeout(5000),            // Cancel if takes > 5s
      catchError(() => of([]))  // Empty list on error
    )
  ),
  startWith([]),
  shareReplay(1)
);
```

---

## Quick Operator Decision Tree

```
Do you need to:

├─ Transform values? 
│  └─ map()
│
├─ Filter values?
│  └─ filter()
│
├─ Combine multiple sources?
│  ├─ Both active? → combineLatest()
│  ├─ Sequential? → concat()
│  ├─ All complete? → forkJoin()
│  ├─ Any order? → merge()
│  └─ Replace previous? → switchMap()
│
├─ Wait before emitting?
│  ├─ At start? → startWith()
│  ├─ While typing? → debounceTime()
│  └─ First emit? → take(1)
│
├─ Flatten nested Observables?
│  ├─ Serial? → concatMap()
│  ├─ Parallel? → mergeMap()
│  ├─ Latest only? → switchMap()
│  └─ Ignore duplicates? → exhaustMap()
│
├─ Handle errors?
│  ├─ Retry? → retry()
│  ├─ Retry + delay? → retryWhen()
│  └─ Fallback? → catchError()
│
├─ Share execution?
│  ├─ One execution? → share()
│  └─ With caching? → shareReplay()
│
├─ Stop emitting?
│  ├─ When component destroys? → takeUntil()
│  └─ After N values? → take(n)
│
└─ Calculate from values?
   ├─ Count? → count()
   ├─ Sum? → reduce()
   ├─ Max/Min? → max(), min()
   └─ Running total? → scan()
```

---

## Common Mistake: Changing Reference

```typescript
// ❌ WRONG - Array reference changes, template detects change every time
data: Data[] = [];
ngOnInit() {
  this.api.getData().subscribe(result => {
    this.data = [...result];  // New array reference!
  });
}

// ✅ CORRECT - Use Observable in template (same reference)
data$ = this.api.getData();
// Template: {{ data$ | async }}
```

---

## Summary Cheat Sheet

| Problem | Solution | Key Operator |
|---------|----------|--------------|
| Search debounce | Wait for pause | `debounceTime()` |
| Double click | Ignore while busy | `exhaustMap()` |
| Multiple filters | Latest from each | `combineLatest()` |
| Load all then show | Wait for completion | `forkJoin()` |
| Step by step | Sequential | `concat()` |
| API caching | Share + cache | `shareReplay()` |
| Retry on error | Auto retry | `retry()` |
| Long operation | Show timeout | `timeout()` |
| Component destroy | Auto unsubscribe | `takeUntil()` |
| Form validity | Combine conditions | `combineLatest()` |

