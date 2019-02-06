import { Component, Input, ViewEncapsulation } from '@angular/core';
import { SectorFlag, SectorFlags } from './../../../interfaces';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-sector-flags',
  templateUrl: './sectorFlags.component.html',
  styleUrls: ['./sectorFlags.component.scss']
})
export class SectorFlagsComponent {
  private SHOW_DURATION = 5000; // Duration to show the popup if yellow flags become green
  _isRace: boolean;
  _sessionData: any;

  yellowFlagActive: boolean;
  sectorsYellow: Array<number>;
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

    // Remove any yellow flags from the array if they are no longer yellow
    if (this.sectorsYellow && this.sectorsYellow.length > 0) {
      if (data.sector1 === SectorFlag.Green && this.sectorsYellow.includes(1)) {
        this.sectorsYellow.splice(this.sectorsYellow.indexOf(1), 1);
      }
      if (data.sector2 === SectorFlag.Green && this.sectorsYellow.includes(2)) {
        this.sectorsYellow.splice(this.sectorsYellow.indexOf(2), 1);
      }
      if (data.sector3 === SectorFlag.Green && this.sectorsYellow.includes(3)) {
        this.sectorsYellow.splice(this.sectorsYellow.indexOf(3), 1);
      }
    }

    // If yellow flag is active and all sectors are now green
    // show track clear widget
    if (this.yellowFlagActive === true &&
      data.sector1 === SectorFlag.Green &&
      data.sector2 === SectorFlag.Green &&
      data.sector3 === SectorFlag.Green) {

      this._showTrackGreen = setTimeout(() => {
        this._showTrackGreen = null; // clear the showTrackGreen which will hide the track clear widget
      }, this.SHOW_DURATION);
    }

    // iterate through each sector, if yellow flag set
    // yellowFlagActive to true otherwise false
    sectors.forEach(sector => {
      if (sector.flag === SectorFlag.Yellow) {
        this.sectorsYellow.push(sector.number);
        this.yellowFlagActive = true;
      } else {
        this.yellowFlagActive = false;
      }
    });
  }
  @Input()
  set sessionData(data: any) {
    if (data == null) {
      return;
    }

    const newSession = data.session;
    this._isRace = newSession.includes('RACE');

    this._sessionData = data;
  }
  constructor() {}
}
