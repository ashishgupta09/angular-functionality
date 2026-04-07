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

  // ===== REAL-WORLD EXAMPLES =====

  // Example 1: Calculate Order Total (E-commerce)
  // calculateOrderTotal(items: CartItem[]): Observable<number> {
  //   return from(items).pipe(
  //     reduce((total, item) => total + (item.price * item.quantity), 0)
  //   );
  // }

  // Example 2: Find Highest Engagement Post
  // getHighestEngagement(posts: Post[]): Observable<number> {
  //   return from(posts).pipe(
  //     map(post => post.likes + post.comments),
  //     max()
  //   );
  // }

  // Example 3: Dashboard Statistics
  // getStats(data: number[]): Observable<{count: number, max: number, min: number, average: number}> {
  //   return combineLatest([
  //     from(data).pipe(count()),
  //     from(data).pipe(max()),
  //     from(data).pipe(min()),
  //     from(data).pipe(reduce((sum, x) => sum + x, 0))
  //   ]).pipe(
  //     map(([count, max, min, sum]) => ({
  //       count, max, min, average: sum / count
  //     }))
  //   );
  // }

  // Example 4: Lowest Price Finder
  // getLowestPrice(products: Product[]): Observable<number> {
  //   return from(products).pipe(
  //     map(p => p.price),
  //     min()
  //   );
  // }

  // Example 5: Running Total (Scan vs Reduce)
  // getRunningTotal(items: number[]): Observable<number> {
  //   return from(items).pipe(
  //     scan((acc, value) => acc + value, 0)  // Emits after each value
  //   );
  //   // Final total only:
  //   // reduce((acc, value) => acc + value, 0)  // Emits once at end
  // }

  // Example 6: Group User Permissions
  // getUserPermissions(roles: Role[]): Observable<{[key: string]: boolean}> {
  //   return from(roles).pipe(
  //     reduce((permissions, role) => ({
  //       ...permissions,
  //       ...role.permissions
  //     }), {})
  //   );
  // }

}
