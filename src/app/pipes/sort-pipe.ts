import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort',
  standalone: true
})
export class SortPipe implements PipeTransform {

  transform(value: any[], order: string = 'asc'): unknown {
    return value.sort((a, b) =>
      order === 'asc' ? a - b : b - a
    )
  }

}
