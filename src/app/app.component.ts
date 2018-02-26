import { Component } from '@angular/core';
import { isEmpty, sortBy } from 'lodash';

import { ConfigService } from './services/config.service';
import { WatchService } from './services/watch.service';

const SESSION_REFRESH_RATE = 750;
const STANDINGS_REFRESH_RATE = 500;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ConfigService, WatchService]
})
export class AppComponent {
  
  teamsConfig: any;
  session: any;
  standings: any = [];
  focusedEntry: any;
  driverLaps: any = {};
  overallBestLap: any = {};

  constructor(
    private configService: ConfigService,
    private watchService: WatchService
  ) {}

  ngOnInit(): void {
    this.teamsConfig = this.configService.getTeamsConfig();

    setInterval(() => this.getSession(), SESSION_REFRESH_RATE);
    setInterval(() => this.getStandings(), STANDINGS_REFRESH_RATE);
  }

  getSession(): void {
    this.watchService.getSession().subscribe(
      session => this.session = session,
      error => console.log(error)
    );
  }

  getStandings(): void {
    this.watchService.getStandings().subscribe(
      standings => {

        // ignore if not in session
        if (this.session === undefined || this.session.session === 'INVALID') {
          return this.standings = [];
        }

        // sort by position
        this.standings = sortBy(standings, 'position');

        // calculate gap + colour + set focused driver
        let focusedEntry;
        this.standings.forEach(entry => {
          const driverName = entry.driverName;

          // does the driver exist in the driverlaps object
          if (this.driverLaps[driverName] === undefined) {
            this.driverLaps[driverName] = {
              best_lap: null,
              laps_checked: 0
            }
          }

          // sector events
          const driverLap = this.driverLaps[driverName];
          entry.gapEvent = null;

          // do we need to save the drivers lap
          const lapsCheckedDifference = entry.lapsCompleted - driverLap.laps_checked;
          if (lapsCheckedDifference === 1) {
            if (entry.lastLapTime > -1) {
              const lap = {
                sector_1: entry.lastSectorTime1,
                sector_2: entry.lastSectorTime2 - entry.lastSectorTime1,
                sector_3: entry.lastLapTime - entry.lastSectorTime2,
                total: entry.lastLapTime
              }

              // gap
              let gapValue = 0;
              if (!isEmpty(this.overallBestLap)) {
                gapValue = entry.lastLapTime - this.overallBestLap.total;
              }
              const gap = (gapValue > 0 ? '+' : '') + gapValue.toFixed(3);

              // gap state + and assign to entry
              const personalBest = (isEmpty(driverLap.best_lap)) ? null : driverLap.best_lap.total;
              const state = this._getLapState('sector_2', lap.total, personalBest);
              entry.gapEvent = {state, gap};
  
              // is this their fastest?
              if (driverLap.best_lap === null || driverLap.total > lap.total) {
                driverLap.best_lap = lap;
              }

              // keep the last lap info on screen
              driverLap.lastLapHold = {counter: 0, lap, gap};
  
              // is this the overall fastest?
              if (isEmpty(this.overallBestLap.total) || this.overallBestLap.total > lap.total) {
                this.overallBestLap = lap;
              }
            }
            driverLap.laps_checked++;
          } else if (lapsCheckedDifference > 1) {
            
            // overlay was started late and does not have access to historic laps
            driverLap.laps_checked = entry.lapsCompleted;
          }

          // are we still showing last lap info
          if (driverLap.lastLapHold) {
            if (driverLap.lastLapHold.counter > 10000) {
              driverLap.lastLapHold = null;
            } else {
              driverLap.lastLapHold.counter += STANDINGS_REFRESH_RATE;
            }
          }
          entry.lastLapHold = driverLap.lastLapHold;

          // have they just completed the 1st or 2nd sector
          if (entry.currentSectorTime1 !== -1) {

            if (entry.currentSectorTime2 !== -1) {

              // sector 2 completed
              let gapValue = 0;
              if (!isEmpty(this.overallBestLap)) {
                gapValue = entry.currentSectorTime2 - (this.overallBestLap.sector_1 + this.overallBestLap.sector_2);
              }
              const gap = (gapValue > 0 ? '+' : '') + gapValue.toFixed(3);

              // gap state + and assign to entry
              const personalBest = (isEmpty(driverLap.best_lap)) ? null : driverLap.best_lap.sector_1 + driverLap.best_lap.sector_2;
              const state = this._getLapState('sector_2', entry.currentSector2Time, personalBest);
              entry.gapEvent = {state, gap};
            } else {

              // sector 1 completed
              const gapValue = isEmpty(this.overallBestLap) ? 0 : entry.currentSectorTime1 - this.overallBestLap.sector_1;
              const gap = (gapValue > 0 ? '+' : '') + gapValue.toFixed(3);

              // gap state + and assign to entry
              const personalBest = (isEmpty(driverLap.best_lap)) ? null : driverLap.best_lap.sector_1;
              const state = this._getLapState('sector_1', entry.currentSectorTime1, personalBest);
              entry.gapEvent = {state, gap};
            }
          }

          // calculate gap to leader
          entry.gapToLeader = (entry.bestLapTime - this.standings[0].bestLapTime).toFixed(3);

          // team colour
          entry.colour = '#FFF';
          const carClass = entry.carClass.toLowerCase();
          if (this.teamsConfig[carClass]) {
            entry.colour = this.teamsConfig[carClass].colour;
          }

          // set focusedentry
          if (entry.focus) focusedEntry = entry;  
        });
        this.focusedEntry = focusedEntry;
      },
      error => console.log(error)
    );
  }
  
  _getSectorColour(state: string): string {
    if (state === 'SESSION_BEST') return 'purple';
    if (state === 'PERSONAL_BEST') return 'green';
    if (state === 'DOWN') return 'red';
  }

  _getLapState(sector: string, current: number, driverBest: number): string {
    if (isEmpty(this.overallBestLap) || current < this.overallBestLap[sector]) {
      return 'SESSION_BEST';
    } else if (driverBest === null || current < driverBest) {
      return 'PERSONAL_BEST';
    } else {
      return 'DOWN';
    }
  }
}
