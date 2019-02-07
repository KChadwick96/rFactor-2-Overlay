import { Component, Input, ViewEncapsulation } from '@angular/core';
import { SectorFlag, SectorFlags } from './../../../interfaces';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-sector-flags',
  templateUrl: './sectorFlags.component.html',
  styleUrls: ['./sectorFlags.component.scss']
})
export class SectorFlagsComponent {
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

    this.clearYellowSectors(data);
    this.checkForTrackGreen(data);
    this.setActiveYellowFlags(sectors);
  }

  /*
   * Removes any yellow flags from the array if they are no longer yellow
   */
  private clearYellowSectors(data: SectorFlags) {
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
  }

  /*
   * If yellow flag is active and all sectors are now green show track clear widget
   */
  private checkForTrackGreen(data) {
    if (
      this.yellowFlagActive === true &&
      data.sector1 === SectorFlag.Green &&
      data.sector2 === SectorFlag.Green &&
      data.sector3 === SectorFlag.Green
    ) {
      this._showTrackGreen = setTimeout(() => {
        this._showTrackGreen = null; // clear the showTrackGreen which hides the track clear widget
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
        this._showTrackGreen = null;
      }
    });

    if (this.sectorsYellow && this.sectorsYellow.length < 1) {
      this.yellowFlagActive = false;
    }
  }
  constructor() {}
}
