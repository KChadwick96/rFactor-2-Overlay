import { Component, Input } from '@angular/core';

import { ProcessedEntry } from '../../../interfaces';
import { OnboardMode, SectorMap } from './interfaces';
import TYRES from '../../../assets/tyres';

@Component({
  selector: 'app-onboard',
  templateUrl: './onboard.component.html',
  styleUrls: ['./onboard.component.scss']
})
export class OnboardComponent {
    mode: OnboardMode;

    private _sectorMaps: Array<SectorMap> = [{
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
    @Input() driver: ProcessedEntry;
    @Input() standings: Array<ProcessedEntry> = [];
    @Input()
    set raceSession(session: string) {
        if (!session) {
            return;
        }

        if (session.includes('PRACTICE') || session.includes('QUALIFY') || session.includes('WARMUP')) {
            this.mode = OnboardMode.FastestGap;
        } else {
            this.mode = OnboardMode.PositionGap;
        }
    }

    constructor() {}

    _getTyreImage() {
        if (this.driver.tyreCompound != null) {
            if (this.driver.tyreCompound.indexOf('Soft') > -1) {
                return TYRES.SOFT;
            }
            if (this.driver.tyreCompound.indexOf('Medium') > -1) {
                return TYRES.MEDIUM;
            }
            if (this.driver.tyreCompound.indexOf('Hard') > -1) {
                return TYRES.HARD;
            }
        }
        return null;
    }

    _getSectorColour(state: string): string {
        const map = this._getMap(state);
        return map.colour;
    }

    _getSectorClass(driver: ProcessedEntry, sector: number): string {
        let state = null;
        const lastLapHold = driver.lastLapHold;
        if (lastLapHold) {
            state = lastLapHold.lap[`sector${sector}State`];
        } else if ((sector === 1 || sector === 2) && driver.currentLap) {
            state = driver.currentLap[`sector${sector}State`];
        }

        const map = this._getMap(state);
        return map ? map.class_name : '';
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

    _getMap(key: string): SectorMap {
        return this._sectorMaps.find(sectorMap => sectorMap.key === key);
    }
}
