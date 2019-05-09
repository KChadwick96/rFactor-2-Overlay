import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input } from '@angular/core';
import { NotificationService } from './../../../services/notification.service';

@Component({
  selector: 'app-fastestsector',
  templateUrl: './fastestsector.component.html',
  styleUrls: ['./fastestsector.component.scss'],
  animations: [
    // the fade-in/fade-out animation.
    trigger('simpleFadeAnimation', [
      // the "in" style determines the "resting" state of the element when it is visible.
      state('in', style({ opacity: 0.9 })),

      // fade in when created.
      transition(':enter', [style({ opacity: 0 }), animate(300)]),

      // fade out when destroyed.
      transition(':leave', animate(300, style({ opacity: 0 })))
    ])
  ]
})
export class FastestSectorComponent {
    private SHOW_DURATION = 10000;  // Duration to show the popup if a fastest lap is set

    _isQualify: boolean;
    _sessionData: any;
    _currentShownFastestSector: any;
    subscription: any;
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
          const sectorNumber = newSector.sector.match(/\d+/g).map(Number);
          this.newFastestSector = {
              sector: sectorNumber,
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
