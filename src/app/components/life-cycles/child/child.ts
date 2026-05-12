import { CommonModule } from '@angular/common';
import { Component, DoCheck, Input, OnChanges, SimpleChanges } from '@angular/core';

interface Employee {
  name: string;
  role: string;
}

@Component({
  selector: 'app-child',
  imports: [CommonModule],
  templateUrl: './child.html',
  styleUrl: './child.scss',
})
export class Child implements OnChanges, DoCheck {

  @Input() employeeId!: number;
  employeeData!: Employee;
  messageForParent = 'Angular Developer';

  employee = {
    name: 'Ashish',
    role: 'Angular Developer'
  };

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges Triggered');
    console.log(changes);

    if (changes['employeeId']) {
      const currentId = changes['employeeId'].currentValue;
      const previousId = changes['employeeId'].previousValue;

      console.log(`currentId : ${currentId}`);
      console.log(`previousId : ${previousId}`);

      this.loadEmployee(currentId);
    }
  }

  loadEmployee(currentId: number) {
    const employees: Employee[] = [
      {
        name: 'Ashish', role: 'Angular Developer',
      },
      {
        name: 'Rahul', role: 'Node Developer',
      },
      {
        name: 'Aman', role: 'UI Developer',
      }
    ]

    this.employeeData = employees[currentId];
  }

  /// on check

  oldName = this.employee.name;
  oldRole = this.employee.role;

  changeName() {
    this.employee.name = 'Rahul';
    this.employee.role = 'Full Stack Developer'
  }

  ngDoCheck(): void {
    console.log('ngDoCheck Called');
    if (this.oldName !== this.employee.name && this.oldRole !== this.employee.role) {
      console.log(
        `Name changed from ${this.oldName}
         to ${this.employee.name}`
      );
      this.oldName = this.employee.name;
      this.oldRole = this.employee.role;
    }
  }

  // AfterViewInit

  message = 'Child Component Loaded';

  showMessage() {
    console.log(this.message);
  }

}
