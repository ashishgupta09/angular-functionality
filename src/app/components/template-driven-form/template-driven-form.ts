import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-template-driven-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './template-driven-form.html',
  styleUrl: './template-driven-form.scss',
})
export class TemplateDrivenForm {

  phoneNumbers: string[] = ['']; 

  addField() {
    this.phoneNumbers.push('');
  }

  removeField(index: number) {
    this.phoneNumbers.splice(index, 1);
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }
    console.log('Form Data:', form.value);
    form.reset();
  }

}
