import { Component, Input } from '@angular/core';
import { ProcessedEntry } from '../../../interfaces';
import { NotificationService } from './../../../services/notification.service';

@Component({
  selector: 'app-fastestsector',
  templateUrl: './fastestsector.component.html',
  styleUrls: ['./fastestsector.component.scss']
})
export class FastestSectorComponent {
    private SHOW_DURATION = 10000;  // Duration to show the popup if a fastest lap is set

    _isQualify: boolean;
    _sessionData: any;
    _currentShownFastestSector: any;
    subscription: any;

    @Input() standings: Array<ProcessedEntry>;
    newFastestSector: any;

    @Input()
    set sessionData(data: any) {
        if (data == null) {
            return;
        }

        const newSession = data.session;
        this._isQualify = newSession.includes('QUALIFY') || newSession.includes('PRACTICE2');

        this._sessionData = data;
    }

    showNewFastestSector(newSector: any): void {

        // set new fastest sector details
        if (newSector) {
            this.newFastestSector = {
                sector: newSector.sector,
                time: newSector.time,
                driver: newSector.driver
            };
        }

        if (this._currentShownFastestSector != null) {
            // if fastest sector currently showing, cancel the SHOW_DURATION timeout
            // and start over with new fastest sector (so it gets shown for 10 seconds).
            clearTimeout(this._currentShownFastestSector);
            this._currentShownFastestSector = null;
        }

        this._currentShownFastestSector = setTimeout(() => {
            this.newFastestSector = null; // clear the new fastest sector property, which will hide the widget
            this._currentShownFastestSector = null;
        }, this.SHOW_DURATION);
    }

    constructor(private notificationService: NotificationService) {
        this.subscription = this.notificationService
        .getNewFastestSector()
        .subscribe(newSector => {
          if (newSector && this._isQualify) {
            this.showNewFastestSector(newSector);
          }
        });
    }
}
