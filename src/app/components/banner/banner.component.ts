import { Component, Input } from '@angular/core';

@Component({
  selector: 'banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent {
    private _mode: string = 'LAP'; // TIME, LAP
    private _sessionData: any;

    @Input() standings: any[];
    @Input() 
    set sessionData(data: any) {
        if (data == null) return;

        if (data.session.includes('PRACTICE') || data.session.includes('QUALIFY')) {
            this._mode = 'TIME';
        } else {
            this._mode = 'LAP';
        }
        
        this._sessionData = data;
    }

    constructor() {}
}
