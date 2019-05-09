import { Component, Input } from '@angular/core';
import { ProcessedEntry } from './../../../interfaces';

@Component({
  selector: 'app-winner',
  templateUrl: './winner.component.html',
  styleUrls: ['./winner.component.scss']
})
export class WinnerComponent {
  _isRace: boolean;
  _sessionData: any;
  winnerDetails: any;
  totalDistance: number;

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

  @Input()
  set lapDistance(distance: number) {
    if (distance == null || this.totalDistance) {
      return;
    }

    this.totalDistance = this._sessionData.maximumLaps * distance;
  }

_isRaceFinished(): boolean {
  if (!this.standings || !this._sessionData) {
      return;
  }

  const lapsCompleted = this.standings[0].lapsCompleted;
  const maximumLaps = this._sessionData.maximumLaps;

  if (lapsCompleted === maximumLaps) {
    this._setWinnerDetails();
    return true;
  } else {
    this.winnerDetails = {};
  }
}

  _setWinnerDetails(): void {
    this.winnerDetails = {
      driver: this.standings[0].driverName,
      team: this.standings[0].carClass,
      time: this._sessionData.currentEventTime,
      distance: this.totalDistance
    };
  }

  constructor() {}
}
