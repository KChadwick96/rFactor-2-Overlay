import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tower-endurance',
  templateUrl: './tower.component.html',
  styleUrls: ['./tower.component.scss']
})
export class TowerEnduranceComponent {
  public entriesToShow: any = [];
  private _interval: any;
  private _standings: any = [];
  private _currentPage = 1;
  private _secondsPerPage = 5 * 1000;

  @Input()
  set standings(data: any) {
      if (!data) {
        return;
      }

      this._standings = data;

      if (!this._interval) {
        this._startCycle();
      }
  }

  constructor() {}

  _startCycle() {
    this._interval = setInterval(() => {
      const pages = Math.ceil(this._standings.length / 5);

      const start = (this._currentPage - 1) * 5;
      this.entriesToShow = this._standings.slice(start, start + 5);

      // reset to 1 if last, otherwise increment
      if (this._currentPage >= pages) {
        this._currentPage = 1;
      } else {
        this._currentPage++;
      }
    }, this._secondsPerPage);
  }
}
