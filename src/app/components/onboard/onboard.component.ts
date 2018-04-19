import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-onboard',
  templateUrl: './onboard.component.html',
  styleUrls: ['./onboard.component.scss']
})
export class OnboardComponent {

    _sectorMaps: Array<ISectorMap> = [{
        key: 'SESSION_BEST',
        colour: 'purple',
        class_name: 'sector--sb'
    }, {
        key: 'PERSONAL_BEST',
        colour: 'green',
        class_name: 'sector--pb'
    }, {
        key: 'DOWN',
        colour: 'red',
        class_name: 'sector--down'
    }];
    _mode: OnboardMode;

    @Input() driver: any;
    @Input() standings: any[] = [];
    @Input()
    set raceSession(session: string) {
        if (!session) {
            return;
        }

        if (session.includes('PRACTICE') || session.includes('QUALIFY') || session.includes('WARMUP')) {
            this._mode = OnboardMode.FastestGap;
        } else {
            this._mode = OnboardMode.PositionGap;
        }
    }

    constructor() {}

    _getSectorColour(state: string): string {
        const map = this._getMap(state);
        return map.colour;
    }

    _getSectorClass(driver: any, sector: number): string {
        let state = null;
        const lastLapHold = driver.lastLapHold;
        if (lastLapHold) {
            state = lastLapHold.lastLap[`sector_${sector}_state`];
        } else if (sector === 1 || sector === 2) {
            state = driver[`sector${sector}State`];
        }

        const map = this._getMap(state);
        return map.class_name;
    }

    _getGapBehind(): number {
        const driverIndex = this.standings.findIndex(entry => entry.position === this.driver.position);
        const behindIndex = driverIndex + 1;

        const driverBehind = this.standings[behindIndex];
        if (!driverBehind) {
            return 0;
        }

        return driverBehind.timeBehindNext;
    }

    _getMap(key: string): ISectorMap {
        return this._sectorMaps.find(sectorMap => sectorMap.key === key);
    }
}

interface ISectorMap {
    key: string;
    colour: string;
    class_name: string;
}

enum OnboardMode {
    FastestGap = 'FASTEST_GAP',
    PositionGap = 'POSITION_GAP'
}
