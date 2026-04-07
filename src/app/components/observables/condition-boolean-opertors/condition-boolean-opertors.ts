import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  defaultIfEmpty,
  every,
  find,
  findIndex,
  from,
  isEmpty,
  of
} from 'rxjs';

@Component({
  selector: 'app-condition-boolean-opertors',
  imports: [CommonModule],
  templateUrl: './condition-boolean-opertors.html',
  styleUrl: './condition-boolean-opertors.scss',
})
export class ConditionBooleanOpertors implements OnInit {

  ngOnInit(): void {

  }

  // defaultIfEmpty emits a default value if the source Observable completes without emitting any value.

  defaultIfEmpty_Operators() {
    of()
      .pipe(defaultIfEmpty('No Data'))
      .subscribe(console.log);
  }

  // every checks if all emitted values satisfy a condition and returns true or false.

  every_Operators() {
    from([2, 4, 6, 8])
      .pipe(every(x => x % 2 === 0))
      .subscribe(console.log);
  }

  // find emits the first value that satisfies a condition and then completes.

  find_Operators() {
    from([10, 20, 30, 40])
      .pipe(find(x => x > 25))
      .subscribe(console.log);
  }

  // findIndex emits the index of the first value that satisfies a condition.

  findIndex_Operators() {
    from([10, 20, 30, 40])
      .pipe(findIndex(x => x > 25))
      .subscribe(console.log);
  }

  // isEmpty checks whether an Observable emits any value and returns true if empty, otherwise false.

  empty_Opertor() {
    of()
      .pipe(isEmpty())
      .subscribe(console.log);
  }

  // ===== REAL-WORLD EXAMPLES =====

  // Example 1: Form Validation - Check if all fields valid
  // allFieldsValid(controls: FormControl[]): Observable<boolean> {
  //   return from(controls).pipe(
  //     every(control => control.valid),
  //     startWith(false)
  //   );
  // }

  // Example 2: Find User by ID
  // findUserById(id: number, users: User[]) {
  //   return from(users).pipe(
  //     find(user => user.id === id),
  //     defaultIfEmpty(null)
  //   );
  // }

  // Example 3: Get Index Position for Update
  // getItemPositionInCart(productId: number, cart: Product[]): Observable<number> {
  //   return from(cart).pipe(
  //     findIndex(item => item.id === productId)
  //   );
  // }

  // Example 4: Check Search Results
  // checkSearchResults(query: string): Observable<string> {
  //   return this.apiService.search(query).pipe(
  //     isEmpty(),
  //     map(isEmpty => isEmpty ? 'No results found' : 'Results available')
  //   );
  // }

  // Example 5: Validate All Items in Array (E-commerce)
  // validateAllItemsInStock(items: Product[]): Observable<boolean> {
  //   return from(items).pipe(
  //     every(item => item.stock > 0)
  //   );
  // }

}
