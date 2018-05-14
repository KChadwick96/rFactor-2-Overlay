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
            length: 10
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

        if (data.session !== this._raceSession) {
            this._raceSession = data.session;
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
