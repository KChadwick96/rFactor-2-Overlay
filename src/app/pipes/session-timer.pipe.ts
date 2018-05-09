import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'minutesAndSeconds' })
export class MinutesAndSecondsPipe implements PipeTransform {
    transform(secondsVal: number, showMiliseconds: boolean = true, alwaysShowMinute: boolean = true): string {
       if (secondsVal <= 0) {
           return '0:00';
       }

       
    }
}
