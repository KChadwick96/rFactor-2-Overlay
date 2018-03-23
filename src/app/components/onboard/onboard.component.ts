import { Component, Input } from '@angular/core';

@Component({
  selector: 'onboard',
  templateUrl: './onboard.component.html',
  styleUrls: ['./onboard.component.scss']
})
export class OnboardComponent {
    _mode: string; // FASTEST_GAP, POSITION_GAP

    @Input() driver: any;
    @Input() standings: any[] = [];
    @Input()
    set raceSession(session: string) {
        if (!session) return;
        
        if (session.includes('PRACTICE') || session.includes('QUALIFY') || session.includes('WARMUP')) {
            this._mode = 'FASTEST_GAP';
        } else {
            this._mode = 'POSITION_GAP';
        }
    }

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

    _getGapBehind(): string {
        const driverIndex = this.standings.findIndex(entry => entry.position === this.driver.position);
        const behindIndex = driverIndex + 1;

        const driverBehind = this.standings[behindIndex];
        if (!driverBehind) {
            return '-';
        }

        return driverBehind.timeBehindNext;
    }
}
