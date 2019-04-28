import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { SectorFlag, SectorFlags } from './../../../interfaces';
import { NotificationService } from './../../../services/notification.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-sector-flags',
  templateUrl: './sectorFlags.component.html',
  styleUrls: ['./sectorFlags.component.scss'],
  animations: [
    // the fade-in/fade-out animation.
    trigger('simpleFadeAnimation', [
      // the "in" style determines the "resting" state of the element when it is visible.
      state('in', style({ opacity: 1 })),

      // fade in when created.
      transition(':enter', [style({ opacity: 0 }), animate(600)]),

      // fade out when destroyed.
      transition(':leave', animate(600, style({ opacity: 0 })))
    ])
  ]
})
export class SectorFlagsComponent {
  constructor(private notificationService: NotificationService) {}

  private SHOW_DURATION = 6000; // Duration to show the popup if yellow flags become green
  _isRace: boolean;
  _sessionData: any;

  yellowFlagActive: boolean;
  sectorsYellow: Array<number> = [];
  _showTrackGreen: any;

  @Input()
  set sectorFlags(data: SectorFlags) {
    if (data == null) {
      return;
    }

    const sectors = [
      { number: 1, flag: data.sector1 },
      { number: 2, flag: data.sector2 },
      { number: 3, flag: data.sector3 }
    ];

    this.clearYellowSectors(data, sectors);
    this.checkForTrackGreen(data);
    this.setActiveYellowFlags(sectors);
  }

   /*
   * Removes any yellow flags from the array if they are no longer yellow
   */
  private clearYellowSectors(data: SectorFlags, sectors: Array<any>) {
    if (this.sectorsYellow && this.sectorsYellow.length > 0) {
      sectors.forEach(sector => {
        if (data['sector' + sector.number] === SectorFlag.Green && this.sectorsYellow.includes(sector.number)) {
          this.sectorsYellow.splice(this.sectorsYellow.indexOf(sector.number), 1);
        }
      });
    }
  }

  /*
   * If yellow flag is active and all sectors are now green show track clear widget
   */
  private checkForTrackGreen(data) {
    if (this.yellowFlagActive === true
      && data.sector1 === SectorFlag.Green
      && data.sector2 === SectorFlag.Green
      && data.sector3 === SectorFlag.Green) {

      this._showTrackGreen = setTimeout(() => {
        this._showTrackGreen = null; // clear the showTrackGreen which hides the track clear widget
        this.notificationService.sendNotification('Inactive');
      }, this.SHOW_DURATION);
    }
  }

  /*
   * Checks if any sector is currently yellow and sets yellowFlag Active to true.
   * If no yellow flags are picked up yellowFlagActive is set to false
   */
  private setActiveYellowFlags(sectors: Array<any>) {
    sectors.forEach(sector => {
      if (sector.flag === SectorFlag.Yellow) {
        if (!this.sectorsYellow.includes(sector.number)) {
          this.sectorsYellow.push(sector.number);
          this.sectorsYellow.sort();
        }
        this.yellowFlagActive = true;
        this.notificationService.sendNotification('Active');
        this._showTrackGreen = null;
      }
    });

    if (this.sectorsYellow && this.sectorsYellow.length < 1) {
      this.yellowFlagActive = false;
    }
  }

  /*
   * Builds the sector list to be displayed
   */
  yellowSectorsList() {
    const length = this.sectorsYellow.length;
    if (length === 1) {
      return this.sectorsYellow[0];
    } else {
      const firstSectors = this.sectorsYellow.slice(0, length - 1);
      return `${firstSectors.join(',')} & ${this.sectorsYellow[length - 1]}`;
    }
  }
}
