import { SectorFlags } from './../../../interfaces';
import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-sector-flags',
  templateUrl: './sectorFlags.component.html',
  styleUrls: ['./sectorFlags.component.scss']
})
export class SectorFlagsComponent {
  _isRace: boolean;
  _sessionData: any;
  sectorOneFlag: string;
  sectorTwoFlag: string;
  sectorThreeFlag: string;

  @Input()
  set sectorFlags(data: SectorFlags) {
    if (data == null) {
      return;
  }
  this.sectorOneFlag = data.sector1;
  this.sectorTwoFlag = data.sector2;
  this.sectorThreeFlag = data.sector3;
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
  constructor() { }
}
