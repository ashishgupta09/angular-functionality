import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'gender',
  standalone: true
})
export class GenderPipe implements PipeTransform {

  transform(value: string): string {
    return value === 'M' ? 'Male' : value === 'F' ? 'Female' : 'Other';
  }

}
