import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'secondsConvert' })
export class SecondsConvertPipe implements PipeTransform {
    transform(seconds: number, showPrefix: boolean = false): string {
        if (seconds < 0) {
            return '';
        }

        // calculate minutes
        const minutes = Math.floor(seconds / 60);
        const minutesStr = (minutes === 0) ? '' : minutes + ':';

        // calculate seconds
        // only prefix 0 if less than 10 seconds
        // and greater than 1 min
        seconds = seconds % 60;
        const secondsPrefix = (seconds < 10 && minutes > 0) ? '0' : '';
        const secondsStr = secondsPrefix + seconds.toFixed(3);

        // build str
        const convertedStr = minutesStr + secondsStr;
        return (showPrefix) ? `+${convertedStr}` : convertedStr;
    }
}
