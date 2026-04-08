import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight',
  standalone: true
})
export class HighlightPipe implements PipeTransform {

  transform(text: string, search: string): string {
    if (!search) return text;
    const pattern = new RegExp(search, 'gi');
    return text.replace(pattern, match => `<mark>${match}</mark>`);
  }

}
