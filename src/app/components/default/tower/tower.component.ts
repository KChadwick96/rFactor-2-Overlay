import { Component, OnInit, Input } from '@angular/core';

import { ProcessedEntry } from '../../../interfaces';
import TYRES from '../../../assets/tyres';

@Component({
  selector: 'app-tower',
  templateUrl: './tower.component.html',
  styleUrls: ['./tower.component.scss']
})
export class TowerComponent implements OnInit {
    mode: string;

    public _isRace: boolean;

    private _raceSession: string;
    private _interval;
    private _schedules: any = {
        quali: [{
            mode: 'BASIC' ,
            length: 5
        }, {
            mode: 'FASTEST_LAP_GAP',
            length: 20
        }],
        race: [{
            mode: 'BASIC' ,
            length: 5
        }, {
            mode: 'GAP_TO_LEADER',
            length: 15
        }, {
            mode: 'BASIC',
            length: 5
        }, {
            mode: 'GAP_TO_NEXT',
            length: 40
        }]
    };

    @Input() standings: Array<ProcessedEntry> = [];
    @Input()
    set sessionData(data: any) {
        if (data == null) {
            return;
        }

        const newSession = data.session;

        this._isRace = newSession.includes('RACE');

        // for race sessions, if its the start or end of the race
        // show the basic tower with names
        let shouldStartCycle = true;
        if (this._isRace) {

            const lapsCompleted = this.standings[0] ? this.standings[0].lapsCompleted : 0;
            if (lapsCompleted === 0 || lapsCompleted >= data.maximumLaps) {
                this._stopCycle();
                shouldStartCycle = false;
                this.mode = 'BASIC';
            }
        }

        this._raceSession = newSession;
        if (shouldStartCycle && !this._interval) {
            this._startCycle();
        }
    }

    constructor() {}

    ngOnInit(): void {
        this._startCycle();
    }

    _getTyreImage(driver: ProcessedEntry): string {
        if (driver.tyreCompound.indexOf('Soft') > -1) {
            return TYRES.SOFT;
        }
        if (driver.tyreCompound.indexOf('Medium') > -1) {
            return TYRES.MEDIUM;
        }
        if (driver.tyreCompound.indexOf('Hard') > -1) {
            return TYRES.HARD;
        }
        return null;
    }

    _startCycle(): void {
        if (!this._raceSession) {
            return;
        }

        this._stopCycle();

        // select schedule based on race session
        let schedule = this._schedules.quali;
        if (this._raceSession.includes('RACE')) {
            schedule = this._schedules.race;
        }

        // go through the schedule and switch when we've reached the part.length
        let currentScheduleIndex = 0;
        let currentDuration = 0;
        this._interval = setInterval(() => {
            const part = schedule[currentScheduleIndex];
            this.mode = part.mode;

            if (currentDuration >= part.length * 1000) {
                currentDuration = 0;

                if (schedule[currentScheduleIndex + 1]) {
                    currentScheduleIndex++;
                } else {
                    currentScheduleIndex = 0;
                }
            } else {
                currentDuration += 1000;
            }
        }, 1000);
    }

    _stopCycle(): void {
        if (this._interval) {
            clearInterval(this._interval);
            this._interval = null;
        }
    }

    _positionClass(position: number): string {
        if (position > 10 && (this._raceSession === 'PRACTICE2' || this._raceSession === 'QUALIFY1')) {
            return 'entry__position--elim';
        }
    }

    /**
     * Stop timing from showing if we're in a race and the entry is pitting
     * @param entry Entry to evalutate
     */
    _shouldShowTiming(entry: ProcessedEntry): boolean {
        return !(this._isRace && entry.pitting);
    }
}
