import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { sortBy, isEmpty } from 'lodash';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { ConfigService } from './config.service';
import { environment } from '../../environments/environment';

@Injectable()
export class WatchService {

  private DATA_REFRESH_RATE = 500;
  private HOLD_LAP_INFO_DELAY = 10000;

  private _baseUrl: string = 'http://localhost:5397/rest/watch';
  private _sessionData: any;
  private _driverLaps: any;   // hold persistent driverlap info
  private _focusedDriver: any;
  private _overallBestLap: any;
  private _teamsConfig: any;

  constructor(
    private http: Http,
    private config: ConfigService
  ) {}

  session(): Observable<any> {
    
    if (this._driverLaps === undefined) this._driverLaps = {};
    if (this._focusedDriver === undefined) this._focusedDriver = null;
    if (this._overallBestLap === undefined) this._overallBestLap = null;
    this._teamsConfig = this.config.getTeamsConfig();

    // fetch session data
    if (environment.production) {
      setInterval(() => {
        this._sessionObservable().subscribe(session => this._sessionData = session);
      });
    }

    return Observable.create(observer => {
      setInterval(() => {

        // test data
        if (!environment.production) {
          const processedStandings = this._processStandings(sampleStandingsData);
          return observer.next({
            session_info: sampleSessionData,
            standings: processedStandings,
            focused_driver: this._focusedDriver,
            overall_best_lap: this._overallBestLap
          });
        }

        // empty or invalid session, return null data 
        if (this._sessionData === undefined || this._sessionData.session === 'INVALID') {
          return observer.next({
            session_info: null,
            standings: [],
            focused_driver: this._focusedDriver,
            overall_best_lap: null
          });
        }

        // live data
        this._standingsObservable().subscribe(standings => {
          const processedStandings = this._processStandings(standings);
          observer.next({
            session_info: this._sessionData,
            standings: processedStandings,
            focused_driver: this._focusedDriver,
            overall_best_lap: this._overallBestLap
          });
        });

      }, this.DATA_REFRESH_RATE);
    });
  }

  _processStandings(standings: Array<any>): Array<any> {
    let processed = [];

    processed = sortBy(standings, 'position');

    processed.forEach(entry => {
      const driverName = entry.driverName;

      // does the driver exist in the driverlaps object
      if (this._driverLaps[driverName] === undefined) {
        this._initialiseDriverLap(driverName);
      }

      const driverLap = this._driverLaps[driverName];
      entry.gapEvent = null;
      entry.gapToLeader = this._gapToBest(entry.bestLapTime);

      // has the driver just finished a lap
      const lapsCheckedDifference = entry.lapsCompleted - driverLap.laps_checked;
      if (lapsCheckedDifference === 1 && entry.lastLapTime > -1) {

        const lastLap = {
          sector_1: entry.lastSectorTime1,
          sector_2: entry.lastSectorTime2 - entry.lastSectorTime1,
          sector_3: entry.lastLapTime - entry.lastSectorTime2,
          total: entry.lastLapTime
        }

        // gap state + and assign to entry
        const personalBest = (isEmpty(driverLap.best_lap)) ? null : driverLap.best_lap.total;
        const state = this._getLapState('sector_2', lastLap.total, personalBest);
        const gap = this._gapToBest(entry.lastLapTime);
        entry.gapEvent = {state, gap};

        // is this their fastest?
        if (driverLap.best_lap === null || driverLap.total > lastLap.total) {
          driverLap.best_lap = lastLap;
        }

        // keep the last lap info on screen
        driverLap.last_lap_hold = {counter: 0, lastLap, gap};

        this._sessionFastestLapCheck(lastLap);
      } 
      driverLap.laps_checked = entry.lapsCompleted;

      this._handleLapHold(entry, driverLap);

      // have they just completed the 1st or 2nd sector
      if (entry.currentSectorTime1 !== -1) {

        if (entry.currentSectorTime2 !== -1) {

          // sector 2 completed
          let gapValue = 0;
          if (!isEmpty(this._overallBestLap)) {
            gapValue = entry.currentSectorTime2 - (this._overallBestLap.sector_1 + this._overallBestLap.sector_2);
          }
          const gap = (gapValue > 0 ? '+' : '') + gapValue.toFixed(3);

          // gap state + and assign to entry
          const personalBest = (isEmpty(driverLap.best_lap)) ? null : driverLap.best_lap.sector_1 + driverLap.best_lap.sector_2;
          const state = this._getLapState('sector_2', entry.currentSector2Time, personalBest);
          entry.gapEvent = {state, gap};
        } else {

          // sector 1 completed
          const gapValue = isEmpty(this._overallBestLap) ? 0 : entry.currentSectorTime1 - this._overallBestLap.sector_1;
          const gap = (gapValue > 0 ? '+' : '') + gapValue.toFixed(3);

          // gap state + and assign to entry
          const personalBest = (isEmpty(driverLap.best_lap)) ? null : driverLap.best_lap.sector_1;
          const state = this._getLapState('sector_1', entry.currentSectorTime1, personalBest);
          entry.gapEvent = {state, gap};
        }
      }

      entry.colour = this._getTeamColour(entry.carClass.toLowerCase());
      if (entry.focus) this._focusedDriver = entry; 
    });

    return processed;
  }

  _initialiseDriverLap(driverName: string): void {
    this._driverLaps[driverName] = {
      best_lap: null,
      laps_checked: 0
    }
  }

  _gapToBest(lapTime: number): string {
    let gapValue = 0;
    if (!isEmpty(this._overallBestLap)) {
      gapValue = lapTime - this._overallBestLap.total;
    }
    return (gapValue > 0 ? '+' : '') + gapValue.toFixed(3);
  }

  _getLapState(sector: string, current: number, driverBest: number): string {
    if (isEmpty(this._overallBestLap) || current < this._overallBestLap[sector]) {
      return 'SESSION_BEST';
    } else if (driverBest === null || current < driverBest) {
      return 'PERSONAL_BEST';
    } else {
      return 'DOWN';
    }
  }

  _sessionFastestLapCheck(lap: any) {
    console.log(this._overallBestLap);
    console.log(lap);
    if (isEmpty(this._overallBestLap) || this._overallBestLap.total > lap.total) {
      this._overallBestLap = lap;
    }
  }

  _handleLapHold(entry: any, driverLap: any): void {
    // are we still showing last lap info
    if (driverLap.last_lap_hold) {
      if (driverLap.last_lap_hold.counter > this.HOLD_LAP_INFO_DELAY) {
        driverLap.last_lap_hold = null;
      } else {
        driverLap.last_lap_hold.counter += this.DATA_REFRESH_RATE;
      }
    }
    entry.lastLapHold = driverLap.lastLapHold;
  }

  _getTeamColour(carClass: string): string {
    let colour = '#FFF';
    if (this._teamsConfig[carClass]) {
      colour = this._teamsConfig[carClass].colour;
    }

    return colour;
  }

  _standingsObservable(): Observable<any> {
    return this.http
      .get(`${this._baseUrl}/standings`)
      .map(this._mapResponse)
      .catch(this._handleError);
  }

  _sessionObservable(): Observable<any> {
    return this.http
      .get(`${this._baseUrl}/sessionInfo`)
      .map(this._mapResponse)
      .catch(this._handleError);
  }

  _mapResponse(response: Response): any {
    return response.json();
  }

  _handleError(error: any): any {
    console.log(error);
  }
}

const sampleSessionData = {
  session: "PRACTICE1",
  serverName: "",
  maximumLaps: 21,
  trackName: "Bahrain International Circuit",
  darkCloud: 0.0,
  raining: 0.0,
  ambientTemp: 29.0,
  trackTemp: 29.0,
  endEventTime: 7230.0,
  currentEventTime: 375.8
}

const sampleStandingsData = [
  {
    "position":9,
    "driverName":"Kieran Chadwick ",
    "bestLapTime":-1.0,
    "pitstops":0,
    "pitting":true,
    "lastLapTime":0.0,
    "vehicleName":"Cian White #48",
    "timeBehindNext":0.0,
    "timeBehindLeader":0.0,
    "lapsBehindLeader":2,
    "lapsBehindNext":1,
    "currentSectorTime1":-1.0,
    "currentSectorTime2":-1.0,
    "lastSectorTime1":0.0,
    "lastSectorTime2":0.0,
    "focus":false,
    "carClass":"Sabre Racing",
    "slotID":0,
    "carStatus":"PITTING",
    "lapsCompleted":0,
    "hasFocus":false
  },
  {"position":5,"driverName":"Mattia Silva","bestLapTime":-1.0,"pitstops":0,"pitting":false,"lastLapTime":-1.0,"vehicleName":"Mattia Silva #47","timeBehindNext":0.0,"timeBehindLeader":0.0,"lapsBehindLeader":1,"lapsBehindNext":1,"currentSectorTime1":-1.0,"currentSectorTime2":-1.0,"lastSectorTime1":-1.0,"lastSectorTime2":-1.0,"focus":true,"carClass":"Disruptive Tech Racing","slotID":1,"carStatus":"FINISHED","lapsCompleted":1,"hasFocus":true},
  {"position":6,"driverName":"AOR Test Driver - Red","bestLapTime":-1.0,"pitstops":0,"pitting":true,"lastLapTime":0.0,"vehicleName":"AOR Test Driver - Red","timeBehindNext":0.0,"timeBehindLeader":0.0,"lapsBehindLeader":2,"lapsBehindNext":1,"currentSectorTime1":-1.0,"currentSectorTime2":-1.0,"lastSectorTime1":0.0,"lastSectorTime2":0.0,"focus":false,"carClass":"AOR Test Team","slotID":2,"carStatus":"PITTING","lapsCompleted":0,"hasFocus":false},
  {"position":10,"driverName":"AOR Test Driver - Silver","bestLapTime":-1.0,"pitstops":0,"pitting":false,"lastLapTime":-1.0,"vehicleName":"AOR Test Driver - Silver","timeBehindNext":0.0,"timeBehindLeader":0.0,"lapsBehindLeader":1,"lapsBehindNext":0,"currentSectorTime1":33.345458984375,"currentSectorTime2":-1.0,"lastSectorTime1":-1.0,"lastSectorTime2":-1.0,"focus":false,"carClass":"AOR Test Team","slotID":3,"carStatus":"DNF","lapsCompleted":1,"hasFocus":false},
  {"position":3,"driverName":"AOR Test Driver - Yellow","bestLapTime":104.36524963378906,"pitstops":0,"pitting":false,"lastLapTime":104.36524963378906,"vehicleName":"AOR Test Driver - Yellow","timeBehindNext":69.04061126708984,"timeBehindLeader":12.173198699951172,"lapsBehindLeader":0,"lapsBehindNext":0,"currentSectorTime1":-1.0,"currentSectorTime2":-1.0,"lastSectorTime1":33.46806335449219,"lastSectorTime2":79.11146545410156,"focus":false,"carClass":"AOR Test Team","slotID":4,"carStatus":"FINISHED","lapsCompleted":2,"hasFocus":false},
  {"position":1,"driverName":"Sam Carpenter","bestLapTime":102.99269104003906,"pitstops":0,"pitting":false,"lastLapTime":102.99269104003906,"vehicleName":"Sam Carpenter #46","timeBehindNext":0.0,"timeBehindLeader":0.0,"lapsBehindLeader":0,"lapsBehindNext":0,"currentSectorTime1":33.90283203125,"currentSectorTime2":-1.0,"lastSectorTime1":33.18882751464844,"lastSectorTime2":77.81517028808594,"focus":false,"carClass":"Sabre Racing","slotID":5,"carStatus":"DNF","lapsCompleted":2,"hasFocus":false},{"position":8,"driverName":"Tino Naukkarinen","bestLapTime":-1.0,"pitstops":0,"pitting":false,"lastLapTime":-1.0,"vehicleName":"Tino Naukkarinen #10","timeBehindNext":0.0,"timeBehindLeader":67.22758483886719,"lapsBehindLeader":0,"lapsBehindNext":0,"currentSectorTime1":32.540618896484375,"currentSectorTime2":-1.0,"lastSectorTime1":-1.0,"lastSectorTime2":-1.0,"focus":false,"carClass":"ACR Zakspeed","slotID":6,"carStatus":"DNF","lapsCompleted":1,"hasFocus":false},{"position":2,"driverName":"AOR Test Driver - Black","bestLapTime":103.86192321777344,"pitstops":0,"pitting":false,"lastLapTime":105.26962280273438,"vehicleName":"AOR Test Driver - Black","timeBehindNext":0.0,"timeBehindLeader":0.0,"lapsBehindLeader":0,"lapsBehindNext":0,"currentSectorTime1":-1.0,"currentSectorTime2":-1.0,"lastSectorTime1":34.29595947265625,"lastSectorTime2":79.72906494140625,"focus":false,"carClass":"AOR Test Team","slotID":7,"carStatus":"FINISHED","lapsCompleted":3,"hasFocus":false},
  {"position":4,"driverName":"AOR Test Driver - Green","bestLapTime":106.20903015136719,"pitstops":0,"pitting":false,"lastLapTime":106.20903015136719,"vehicleName":"AOR Test Driver - Green","timeBehindNext":-60.82139587402344,"timeBehindLeader":-48.648197174072266,"lapsBehindLeader":0,"lapsBehindNext":0,"currentSectorTime1":34.31390380859375,"currentSectorTime2":79.15994262695312,"lastSectorTime1":36.229339599609375,"lastSectorTime2":81.39878845214844,"focus":false,"carClass":"AOR Test Team","slotID":8,"carStatus":"NONE","lapsCompleted":2,"hasFocus":false},{"position":7,"driverName":"Scott Davison","bestLapTime":-1.0,"pitstops":0,"pitting":false,"lastLapTime":0.0,"vehicleName":"Scott Davison #13","timeBehindNext":-74.79524230957031,"timeBehindLeader":0.0,"lapsBehindLeader":1,"lapsBehindNext":0,"currentSectorTime1":-1.0,"currentSectorTime2":-1.0,"lastSectorTime1":0.0,"lastSectorTime2":0.0,"focus":false,"carClass":"Defiance Racing","slotID":9,"carStatus":"NONE","lapsCompleted":0,"hasFocus":false},
  {"position":11,"driverName":"Craig Baxter","bestLapTime":-1.0,"pitstops":0,"pitting":false,"lastLapTime":-1.0,"vehicleName":"Craig Baxter #9","timeBehindNext":-55.17249298095703,"timeBehindLeader":43.16745376586914,"lapsBehindLeader":0,"lapsBehindNext":0,"currentSectorTime1":33.73773193359375,"currentSectorTime2":78.95513916015625,"lastSectorTime1":-1.0,"lastSectorTime2":-1.0,"focus":false,"carClass":"Defiance Racing","slotID":10,"carStatus":"NONE","lapsCompleted":1,"hasFocus":false}
]
