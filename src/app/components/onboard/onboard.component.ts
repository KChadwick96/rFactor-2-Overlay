import { Component, Input } from '@angular/core';

@Component({
  selector: 'onboard',
  templateUrl: './onboard.component.html',
  styleUrls: ['./onboard.component.scss']
})
export class OnboardComponent {
    
    @Input() driver: any;

    constructor() {}

    _getSectorColour(state: string): string {
        if (state === 'SESSION_BEST') return 'purple';
        if (state === 'PERSONAL_BEST') return 'green';
        if (state === 'DOWN') return 'red';
        return '';
    }
    
    _getSectorClass(driver: any, sector: number): string {
        let state = null;
        const lastLapHold = driver.lastLapHold;
        if (lastLapHold) {
            state = lastLapHold.lastLap[`sector_${sector}_state`];      
        } else if (sector === 1 || sector === 2) {
            state = driver[`sector${sector}State`];
        }
    
        if (state === 'SESSION_BEST') return 'sector--sb';
        if (state === 'PERSONAL_BEST') return 'sector--pb';
        if (state === 'DOWN') return 'sector--down';
        return '';
    }
}
