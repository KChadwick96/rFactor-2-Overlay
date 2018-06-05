import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'sessionTimer' })
export class SessionTimerPipe implements PipeTransform {
    transform(seconds: number, endurance: boolean = false): string {
        console.log(seconds);
        if (seconds <= 0) {
            return endurance ? '00:00:00' : '00:00';
        }

        const date = new Date(null);
        date.setSeconds(seconds);
        const from = endurance ? 11 : 14;
        const length = endurance ? 8 : 5;
        return date.toISOString().substr(from, length);
    }
}
