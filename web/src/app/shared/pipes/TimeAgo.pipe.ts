import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'TimeAgo',
  standalone: true,
})
export class TimeAgoPipe implements PipeTransform {
  transform(date: Date | string): string {
    // TODO I will investigate how use them args

    if (typeof date === 'string') {
      date = new Date(date);
    }
    if (!(date instanceof Date)) {
      return 'Invalid date';
    }

    const now = new Date();

    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals = [
      { label: 'año', seconds: 31536000 },
      { label: 'mes', seconds: 2592000 },
      { label: 'día', seconds: 86400 },
      { label: 'hora', seconds: 3600 },
      { label: 'minuto', seconds: 60 },
      { label: 'segundo', seconds: 1 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);

      if (count > 0) {
        return `hace ${count} ${interval.label}${count !== 1 ? 's' : ''}`;
      }
    }

    return 'Hace un momento';
  }
}
