import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'toMinutes' })
export class ToMinutesPipe implements PipeTransform {
    transform(seconds: number, showMilliseconds: boolean = false): string {
        if (seconds == -1) return '-';

        const minutes = Math.floor(seconds / 60);
        seconds = seconds - minutes * 60;
        let secondsStr = showMilliseconds ? seconds.toFixed(3) : Math.round(seconds);

        secondsStr = (seconds < 10) ? `0${secondsStr}` : `${secondsStr}`;
        if (secondsStr === '60') secondsStr = '00';

        return (minutes > 0) ? `${minutes}:${secondsStr}` : secondsStr;
    }
}