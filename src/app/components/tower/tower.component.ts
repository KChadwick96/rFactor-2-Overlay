import { Component, Input } from '@angular/core';

@Component({
  selector: 'tower',
  templateUrl: './tower.component.html',
  styleUrls: ['./tower.component.scss']
})
export class TowerComponent {
    private _raceSession: string;
    private _interval;
    private _mode;
    private _schedules: any = {
        quali: [{
            mode: 'BASIC' ,
            length: 5   
        },{
            mode: 'FASTEST_LAP_GAP',
            length: 20
        }],
        race: [{
            mode: 'BASIC' ,
            length: 5   
        },{
            mode: 'GAP_TO_LEADER',
            length: 30
        }]
    };

    @Input() standings: any[] = [];

    @Input() 
    set raceSession(session: string) {
        if (session !== this._raceSession) {
            this._raceSession = session;
            this._startCycle();
        }
    }

    constructor() {}

    ngOnInit(): void {
        this._startCycle();
    }

    _startCycle(): void {
        if (!this._raceSession) return;

        // clear existing loop and select schedule based on race session
        if (this._interval !== undefined) clearInterval(this._interval);
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
}
