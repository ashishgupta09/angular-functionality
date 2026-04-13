import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Data {

  private dataSource = new BehaviorSubject<string>('');
  currentData$ = this.dataSource.asObservable();

  setData(value: string) {
    this.dataSource.next(value);
  }


}
