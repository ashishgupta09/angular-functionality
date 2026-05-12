import { CommonModule } from '@angular/common';
import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { Child } from '../child/child';

@Component({
  selector: 'app-parent',
  imports: [CommonModule, Child],
  templateUrl: './parent.html',
  styleUrl: './parent.scss',
  schemas: [NO_ERRORS_SCHEMA]
})
export class Parent implements 
AfterViewInit,
AfterViewChecked,
AfterContentInit {
  selectedEmployeeId = 1;
  count = 0;
  message = 'Child Component Loaded';
  developer = 'Angular Developer'

  @ViewChild(Child) child!: Child;

  ngAfterContentInit(): void {
    // ngAfterContentInit is a lifecycle hook that executes once after Angular initializes content projected into a component
    // using ng-content. It is commonly used in reusable components like cards, modals, and layout wrappers where dynamic content 
    // is passed from parent components.
    console.log(
      'Projected Content Initialized'
    );
  }

  ngAfterContentChecked():void{
    // ngAfterContentChecked is a lifecycle hook that executes after every Angular change detection cycle once projected content
    // inside a component is checked. It is mainly used to monitor updates in dynamically projected content using ng-content,
    // but heavy logic should be avoided because it runs frequently.
     console.log(
      'Projected Content Checked'
    );
  }

  ngAfterViewInit(): void {

    // ngAfterViewInit is a lifecycle hook that executes once after the component view and all child views are fully initialized.
    // It is mainly used for accessing ViewChild elements, DOM manipulation, initializing charts, autofocus functionality,
    // and integrating third-party UI libraries.

    console.log(
      'Parent View Initialized'
    );
    this.child?.showMessage();
  }

  ngAfterViewChecked(): void {
    // ngAfterViewChecked() is a lifecycle hook that is called after
    //  every change detection cycle once the component view and child views have been checked by Angular.

    console.log(
      'View Checked'
    );
  }

  changeEmployee(id: number) {
    this.selectedEmployeeId = id;
    console.log(this.selectedEmployeeId);
  }

  increaseCount() {
    this.count++;
  }

  changeMessage(){
    this.developer = 'Senior Angular Developer'
  }

}
