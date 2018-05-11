import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'sessionTimer' })
export class SessionTimerPipe implements PipeTransform {
    transform(seconds: number): string {
       if (seconds <= 0) {
           return '00:00';
       }

        const date = new Date(null);
        date.setSeconds(seconds);
        return date.toISOString().substr(14, 5);
    }
}
