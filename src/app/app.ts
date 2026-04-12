import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('Angular-Practice');


  ngOnInit(): void {
    this.evenNumbers();
    this.sumOfEvenNumbers();
    this.findMissingNumber();
    this.flattenArray();
    this.findGraterThenFour();
    this.removeTheString();
    this.findMaxNumber();
    this.asendingArray();
  }

  evenNumbers() {
    let arrayElement = [1, 23, 4, 5, 6, 7, 8, 91, 22]
    let evenNumber = [];

    for (let i = 0; i < arrayElement.length; i++) {
      if (arrayElement[i] % 2 === 0) {
        console.log(evenNumber.push(arrayElement[i]));
      }
    }
  }

  sumOfEvenNumbers() {
    let arrayElement = [1, 23, 4, 5, 6, 7, 8, 91, 22];
    let sum = 0;

    for (let i = 0; i < arrayElement.length; i++) {
      if (arrayElement[i] % 2 === 0) {
        sum = sum + arrayElement[i];
      }
    }
    console.log(`Sum of Even Number = ${sum}`);
  }

  findMissingNumber() {
    let arr = [1, 2, 3, 4, 6, 7, 8, 9];

    for (let i = 1; i < arr.length + 1; i++) {
      if (!arr.includes(i)) {
        console.log(`Missing Number is ${i}`);
        break;
      }
    }
  }

  flattenArray() {
    let arr = [[1, 2], [3, 4], [5, 6]];
    let result = [];

    //1
    let reduceResult = arr.reduce((acc, curr) => acc.concat(curr), []);

    //2
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr[i].length; j++) {
        result.push(arr[i][j]);
      }
    }

    console.log(`Flatten Array is ${result}`)
    console.log(reduceResult);
  }

  findGraterThenFour() {
    let arr = [1, 2, 3, 4, 6, 7, 8, 9];
    let result = [];

    for (let i = 0; i < arr.length; i++) {
      if (arr[i] > 4) {
        result.push(arr[i])
      }
    }

    console.log(`Greater Array is ${result}`)
  }

  removeTheString() {
    let arr = [1, 2, 3, 'a', 5, 7, 8];
    let result = [];

    for (let i = 0; i < arr.length; i++) {
      if (typeof arr[i] === 'number') {
        result.push(arr[i]);
      }
    }

    console.log(`Removed String Array is ${result}`)
  }

  findMaxNumber() {
    let arr = [1, 2, 3, 4, 6, 7, 8, 9];
    let max = arr[0];

    for (let i = 1; i < arr.length; i++) {
      if (arr[i] > max) {
        max = arr[i];
      }
    }

    console.log(`Maximun Number : ${max}`)
  }

  asendingArray() {
    let arrayElement = [1, 23, 4, 5, 6, 7, 8, 91, 22];
    arrayElement.sort((a, b) => a - b);
    console.log(arrayElement);
  }

}
