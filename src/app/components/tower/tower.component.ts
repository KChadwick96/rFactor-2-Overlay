import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tower',
  templateUrl: './tower.component.html',
  styleUrls: ['./tower.component.scss']
})
export class TowerComponent implements OnInit {
    private _raceSession: string;
    private _interval;
    private _mode;
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

    @Input() standings: any[] = [];
    @Input()
    set sessionData(data: any) {
        if (data == null) {
            return;
        }

        const previousSession = this._raceSession;
        const newSession = data.session;

        // for race sessions, if its the start or end of the race
        // show the basic tower with names
        let shouldStartCycle = true;
        if (newSession.includes('RACE')) {

            const lapsCompleted = this.standings[0] ? this.standings[0].lapsCompleted : 0;
            if (lapsCompleted === 0 || lapsCompleted >= data.maximumLaps) {
                this._stopCycle();
                shouldStartCycle = false;
                this._mode = 'BASIC';
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
            this._mode = part.mode;

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
        }
    }
}
