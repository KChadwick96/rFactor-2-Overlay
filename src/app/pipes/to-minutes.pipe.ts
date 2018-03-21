import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'toMinutes' })
export class ToMinutesPipe implements PipeTransform {
    transform(seconds: number, showMilliseconds: boolean = false, showStartZero = true, alwaysShowMinutes = false): string {
        if (seconds == -1) return '-';

        const minutes = Math.floor(seconds / 60);
        seconds = seconds - minutes * 60;
        let secondsStr = showMilliseconds ? seconds.toFixed(3) : Math.round(seconds);

        secondsStr = (seconds <= 9 && showStartZero) ? `0${secondsStr}` : `${secondsStr}`;
        if (secondsStr === '60') secondsStr = '00';
        
        let minutesStr = (minutes > 0 || alwaysShowMinutes) ? `${minutes}:` : '';

        return `${minutesStr}${secondsStr}`;
    }
}