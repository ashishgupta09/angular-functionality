import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Form } from '../../services/form';
import { FormField } from '../../interfaces/form-field.interface';

@Component({
  selector: 'app-dynamic-forms',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dynamic-forms.html',
  styleUrl: './dynamic-forms.scss',
})
export class DynamicForms implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(Form);
  dynamicForms!: FormGroup;
  formFields: FormField[] = [];
  loading = false;

  ngOnInit(): void {
    this.loadFields();
  }

  loadFields() {
    this.loading = true;
    this.service.getFromField().subscribe({
      next: (res) => {
        this.formFields = res;
        this.creteForm();
        this.loading = false;
      },
      error: (error) => {
        console.log(error);
        this.loading = false;
      },
    });
  }

  creteForm() {
    const group: Record<string, any> = {};
    this.formFields.forEach((field: FormField) => {
      const validatorsArray: ValidatorFn[] = [];

      if (field.validators?.includes('required')) {
        validatorsArray.push(Validators.required);
      }

      if (field.validators?.includes('email')) {
        validatorsArray.push(Validators.email);
      }

      const minLengthValidator = field.validators?.find((x: string) => x.includes('minLength'));

      if (minLengthValidator) {
        const length = Number(minLengthValidator.split(':')[1]);

        validatorsArray.push(Validators.minLength(length));
      }
      group[field.name] = ['', validatorsArray];
    });

    this.dynamicForms = this.fb.group(group);
  }

  onSubmit() {
    if (this.dynamicForms.invalid) {
      this.dynamicForms.markAllAsTouched();
      return;
    }

    const formValue = this.dynamicForms.value;
    this.service.addFormData(formValue).subscribe({
      next: (res) => {
        console.log(res);
        this.dynamicForms.reset();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
