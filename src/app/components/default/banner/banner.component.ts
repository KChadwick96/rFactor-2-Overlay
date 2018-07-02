import { Component, Input } from '@angular/core';

import { ProcessedEntry } from '../../../interfaces';
@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent {
    _mode: string; // TIME, LAP
    _sessionData: any;

    @Input() standings: Array<ProcessedEntry>;
    @Input()
    set sessionData(data: any) {
        if (data == null) {
            return;
        }

        if (data.session.includes('PRACTICE') || data.session.includes('QUALIFY') || data.session.includes('WARMUP')) {
            this._mode = 'TIME';
        } else {
            this._mode = 'LAP';
        }

        this._sessionData = data;
    }

    constructor() {}

    _getLapCounter(): string {
        if (!this.standings || !this._sessionData) {
            return '-';
        }

        const lapsCompleted = this.standings[0].lapsCompleted;
        const maximumLaps = this._sessionData.maximumLaps;

        if (maximumLaps - lapsCompleted === 1) {
            return 'LAST LAP';
        } else if (lapsCompleted === maximumLaps) {
            return 'FINISH';
        } else {
            return `LAP ${lapsCompleted + 1}/${maximumLaps}`;
        }
    }
}
