import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'minutesAndSeconds' })
export class MinutesAndSecondsPipe implements PipeTransform {
    transform(secondsVal: number, showMiliseconds: boolean = true, alwaysShowMinute: boolean = true): string {
        if (secondsVal < 0) {
            return '-';
        }

        // calculate minutes
        const minutes = Math.floor(secondsVal / 60);
        const minutesStr = (minutes === 0 && !alwaysShowMinute) ? '' : minutes + ':';

        // calculate seconds
        // only prefix 0 if less than 10 seconds
        // and greater than 1 min
        const seconds = secondsVal % 60;
        const dp = (showMiliseconds) ? 3 : 0;
        let secondsPrefix = '';
        if (seconds < 10 && (minutes > 0 || alwaysShowMinute)) {
            secondsPrefix = '0';
        }
        const secondsStr = secondsPrefix + seconds.toFixed(dp);

        return minutesStr + secondsStr;
    }
}
