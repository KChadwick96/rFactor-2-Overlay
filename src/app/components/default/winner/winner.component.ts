import { Component, Input } from '@angular/core';
import { ProcessedEntry } from './../../../interfaces';
import { trigger, state, transition, animate, style } from '@angular/animations';

@Component({
  selector: 'app-winner',
  templateUrl: './winner.component.html',
  styleUrls: ['./winner.component.scss'],
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
export class WinnerComponent {
  private SHOW_DURATION = 6000;
  _isRace: boolean;
  _sessionData: any;
  winnerDetails: any;
  oneLapDistance: number;
  winnerShown: boolean;
  showWinner: any;

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
    if (distance == null || this.oneLapDistance) {
      return;
    }
    // convert meters to kilometers
    distance = (distance *  0.001);
    this.oneLapDistance = distance;
  }

  /**
   * checks if the race has finished and will call _setWinnerDetails
   * if it has. returns true if finished, false otherwise
   */
  _isRaceFinished(): boolean {
    if (!this.standings || !this._sessionData || !this._isRace) {
      return;
    }

    const lapsCompleted = this.standings[0].lapsCompleted;
    const maximumLaps = this._sessionData.maximumLaps;

    if (lapsCompleted >= maximumLaps) {
      if (!this.winnerShown && !this.winnerDetails) {
        this._setWinnerDetails();
      }
      return true;
    } else {
      this.winnerDetails = null;
    }
  }

  /**
   * Sets showwinner with timeout for how long it has to be displayed.
   * Also sets winner details which will be used for component display.
   */
  _setWinnerDetails(): void {
    this.winnerDetails = {
      driver: this.standings[0].driverName,
      team: this.standings[0].carClass,
      time: this._sessionData.currentEventTime,
      distance: this._sessionData.maximumLaps * this.oneLapDistance
    };

    this.showWinner = setTimeout(() => {
      this.winnerShown = true;
      this.showWinner = null;
    }, this.SHOW_DURATION);
  }

  constructor() {}
}
