import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'minutesAndSeconds' })
export class MinutesAndSecondsPipe implements PipeTransform {
    transform(secondsVal: number, showMiliseconds: boolean = true, alwaysShowMinute: boolean = true): string {
        if (secondsVal == -1) return '-';
        
        // calculate minutes
        const minutes = Math.floor(secondsVal / 60);
        const minutesStr = (minutes == 0 && !alwaysShowMinute) ? '' : minutes + ':';
        
        // calculate seconds
        // only prefix 0 if less than 10 seconds
        // and greater than 1 min
        const seconds = secondsVal % 60;
        let dp = 0;
        if (showMiliseconds) dp = 3;
        const secondsPrefix = (seconds < 10 && minutes > 0) ? '0' : '';
        const secondsStr = secondsPrefix + seconds.toFixed(dp);

        return minutesStr + secondsStr;
    }
}