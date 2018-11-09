import { Component, Input } from '@angular/core';

import { ProcessedEntry, Lap } from '../../../interfaces';

@Component({
  selector: 'app-fastestlap',
  templateUrl: './fastestlap.component.html',
  styleUrls: ['./fastestlap.component.scss']
})
export class FastestLapComponent {
    private SHOW_DURATION = 10000;  // Duration to show the popup if a fastest lap is set

    _isRace: boolean;
    _sessionData: any;
    _currentShownFastestLap: any;

    @Input() standings: Array<ProcessedEntry>;
    @Input() newFastestLap: Lap;
    @Input()
    set sessionData(data: any) {
        if (data == null) {
            return;
        }

        const newSession = data.session;
        this._isRace = newSession.includes('RACE');

        this._sessionData = data;
    }

    @Input()
    set fastestLap(lap: Lap) {
        if (!lap || !this._isRace) {
            return;
        }

        const lapsCompleted = this.standings[0].lapsCompleted;
        if (lapsCompleted < 3) {
            return;
        }

        if (this._currentShownFastestLap != null) {
            // if fastest lap currently showing, cancel the SHOW_DURATION timeout
            // and start over with new fastest lap (so it gets shown for 10 seconds).
            clearTimeout(this._currentShownFastestLap);
            this._currentShownFastestLap = null;
        }

        this.newFastestLap = lap;

        this._currentShownFastestLap = setTimeout(() => {
            this.newFastestLap = null; // clear the new fastest lap property, which will hide the widget
            this._currentShownFastestLap = null;
        }, this.SHOW_DURATION);
    }

    constructor() {}
}
