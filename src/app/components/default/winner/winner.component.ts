import { ProcessedEntry } from './../../../interfaces';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-winner',
  templateUrl: './winner.component.html',
  styleUrls: ['./winner.component.scss']
})
export class WinnerComponent {
  _isRace: boolean;
  _sessionData: any;
  winnerDetails: any;

  @Input() standings: Array<ProcessedEntry>;
  @Input()
  set sessionData(data: any) {
    if (data == null) {
        return;
    }

    const newSession = data.session;
    this._isRace = newSession.includes('RACE');

    this._sessionData = data;
}

_isRaceFinished(): boolean {
  if (!this.standings || !this._sessionData) {
      return;
  }

  const lapsCompleted = this.standings[0].lapsCompleted;
  const maximumLaps = this._sessionData.maximumLaps;

  if (lapsCompleted === maximumLaps) {
    this.winnerDetails = {
      driver: this.standings[0].driverName,
      team: this.standings[0].vehicleName,
      fastestLap: this.standings[0].bestLapTime
    };
    return true;
  } else {
    this.winnerDetails = {};
  }
}
  constructor() {}
}
