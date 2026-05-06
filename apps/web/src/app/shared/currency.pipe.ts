import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'lak', standalone: true })
export class LakCurrencyPipe implements PipeTransform {
  transform(value: string | number | undefined): string {
    if (value === undefined || value === null) return '₭0';
    return `₭${Number(value).toLocaleString('lo-LA')}`;
  }
}

