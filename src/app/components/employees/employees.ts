import { Component, OnInit, inject } from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Employee } from '../../services/employee';
import { EmployeeModel } from '../../interfaces/employee.interface';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],

  templateUrl: './employees.html',
  styleUrl: './employees.scss',
})
export class Employees implements OnInit {
  private fb = inject(FormBuilder);
  private employeeService = inject(Employee);
  employeeForm!: FormGroup;
  employees: EmployeeModel[] = [];
  isEditMode = false;
  selectedEmployeeId!: number;

  ngOnInit(): void {
    this.initializeForm();
    this.addSkill();
    this.getEmployees();
  }

  initializeForm() {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      skills: this.fb.array([]),
    });
  }

  // FORM ARRAY GETTER

  get skills(): FormArray {
    return this.employeeForm.get('skills') as FormArray;
  }

  // ADD SKILL

  addSkill() {
    this.skills.push(new FormControl('', Validators.required));
  }

  // REMOVE SKILL

  removeSkill(index: number) {
    this.skills.removeAt(index);
  }

  // GET EMPLOYEES

  getEmployees() {
    this.employeeService.getEmployees().subscribe({
      next: (res) => {
        this.employees = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // SUBMIT FORM

  onSubmit() {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    const payload = this.employeeForm.value;

    // EDIT EMPLOYEE

    if (this.isEditMode) {
      this.employeeService.updateEmployee(this.selectedEmployeeId, payload).subscribe({
        next: () => {
          this.getEmployees();
          this.resetForm();
        },
        error: (err) => {
          console.log(err);
        },
      });
    }

    // ADD EMPLOYEE
    else {
      this.employeeService.addEmployee(payload).subscribe({
        next: () => {
          this.getEmployees();
          this.resetForm();
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  // EDIT EMPLOYEE

  editEmployee(employee: EmployeeModel) {
    this.isEditMode = true;
    this.selectedEmployeeId = employee.id!;

    // PATCH NORMAL FIELDS

    this.employeeForm.patchValue({
      name: employee.name,
      email: employee.email,
      role: employee.role,
    });

    // CLEAR OLD SKILLS

    this.skills.clear();

    // PATCH SKILLS

    employee.skills.forEach((skill: string) => {
      this.skills.push(new FormControl(skill, Validators.required));
    });
  }

  // DELETE EMPLOYEE

  deleteEmployee(id: number) {
    this.employeeService.deleteEmployee(id).subscribe({
      next: () => {
        this.getEmployees();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // RESET FORM

  resetForm() {
    this.isEditMode = false;
    this.employeeForm.reset();
    this.skills.clear();
    this.addSkill();
  }
}
