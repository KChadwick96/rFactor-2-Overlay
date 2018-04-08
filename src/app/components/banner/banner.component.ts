import { Component, Input } from '@angular/core';

@Component({
  selector: 'banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent {
    _mode: string; // TIME, LAP
    _sessionData: any;

    @Input() standings: any[];
    @Input() 
    set sessionData(data: any) {
        if (data == null) return;

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
        if (lapsCompleted === maximumLaps) {
            return `LAP ${lapsCompleted}/${maximumLaps}`;
        } else {
            return `LAP ${lapsCompleted + 1}/${maximumLaps}`;
        }
    }
}
