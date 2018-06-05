import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import * as SocketIO from 'socket.io-client';
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
  private BASE_URL = 'http://localhost:5397/rest/watch';
  private SOCKET_URL = 'http://localhost';

  private _sessionData: any;
  private _driverLaps: any;   // hold persistent driverlap info
  private _focusedDriver: any;
  private _overallBestLap: any;
  private _teamsConfig: any;
  private _driversConfig: any;
  private _socket: SocketIOClient.Socket;
  private _streamInterval: any;

  constructor(
    private http: Http,
    private config: ConfigService
  ) {}

  session(): Observable<any> {
    this._resetData();

    this._teamsConfig = this.config.get('teams');
    this._driversConfig = this.config.get('drivers');

    // fetch session data
    if (environment.production) {
      setInterval(() => {
        this._sessionObservable().subscribe(session => {
          if (this._sessionData && this._sessionData.session !== session.session) {
            this._resetData();
          }

          this._sessionData = session;
        });
      }, this.DATA_REFRESH_RATE);
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
            focused_driver: null,
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
      if (lapsCheckedDifference === 1) {
        if (entry.lastLapTime > -1) {

          // get last lap and use previously calculated sector states
          const lastLap = this._getLastLap(entry, driverLap);
          lastLap.sector_1_state = driverLap.sector_1_state;
          lastLap.sector_2_state = driverLap.sector_2_state;
          driverLap.sector_1_state = driverLap.sector_2_state = null;

          // gap state + and assign to entry
          const personalBest = (isEmpty(driverLap.best_lap)) ? null : driverLap.best_lap.total;
          const state = this._getLapState('total', lastLap.total, personalBest);
          const gap = this._gapToBest(entry.lastLapTime);
          entry.gapEvent = {state, gap};

          // is this their pb?
          if (driverLap.best_lap === null || driverLap.total > lastLap.total) {
            driverLap.best_lap = lastLap;
          }

          // keep the last lap info on screen
          driverLap.last_lap_hold = {counter: 0, lastLap, gap, state};

          this._sessionFastestLapCheck(lastLap);
        }
      }
      driverLap.laps_checked = entry.lapsCompleted;

      entry.lastLapHold = this._updateLastLapHold(driverLap);
      entry.sector1State = driverLap.sector_1_state;
      entry.sector2State = driverLap.sector_2_state;

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
          driverLap.sector_2_state = state;
        } else {

          // sector 1 completed
          const gapValue = isEmpty(this._overallBestLap) ? 0 : entry.currentSectorTime1 - this._overallBestLap.sector_1;
          const gap = (gapValue > 0 ? '+' : '') + gapValue.toFixed(3);

          // gap state + and assign to entry
          const personalBest = (isEmpty(driverLap.best_lap)) ? null : driverLap.best_lap.sector_1;
          const state = this._getLapState('sector_1', entry.currentSectorTime1, personalBest);
          entry.gapEvent = {state, gap};
          driverLap.sector_1_state = state;
        }
      }

      // clear sector states if driver in pits
      if (entry.pitting) {
        driverLap.sector_1_state = driverLap.sector_2_state = null;
        entry.sector1State = entry.sector2State = null;
      }

      entry.colour = this._getTeamColour(entry.carClass.toLowerCase());
      entry.flag = this._getDriverFlag(entry.driverName);
      if (entry.focus) {
        this._focusedDriver = entry;
      }
    });

    return processed;
  }

  _initialiseDriverLap(driverName: string): void {
    this._driverLaps[driverName] = {
      best_lap: null,
      laps_checked: 0,
      sector_1_state: null,
      sector_2_state: null
    };
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

  _getLastLap(entry: any, driverLap: any): any {

    // pb data
    let sector1PB, sector2PB, sector3PB = null;
    if (!isEmpty(driverLap.best_lap)) {
      sector1PB = driverLap.best_lap.sector_1;
      sector2PB = driverLap.best_lap.sector_2;
      sector3PB = driverLap.best_lap.sector_3;
    }

    // last sector data
    const sector1Last = entry.lastSectorTime1;
    const sector2Last = entry.lastSectorTime2 - sector1Last;
    const sector3Last = entry.lastLapTime - entry.lastSectorTime2;

    const lastLap = {
      sector_1: sector1Last,
      sector_1_state: null,
      sector_2: sector2Last,
      sector_2_state: null,
      sector_3: sector3Last,
      sector_3_state: this._getLapState('sector_3', sector3Last, sector3PB),
      total: entry.lastLapTime
    };

    return lastLap;
  }

  _sessionFastestLapCheck(lap: any) {
    if (isEmpty(this._overallBestLap) || this._overallBestLap.total > lap.total) {
      this._overallBestLap = lap;
    }
  }

  _updateLastLapHold(driverLap: any): void {
    let hold = driverLap.last_lap_hold;

    // are we still showing last lap info
    if (hold) {
      if (hold.counter > this.HOLD_LAP_INFO_DELAY) {
        hold = null;
      } else {
        hold.counter += this.DATA_REFRESH_RATE;
      }
    }

    return hold;
  }

  _getTeamColour(carClass: string): string {
    let colour = '#FFF';
    if (this._teamsConfig[carClass]) {
      colour = this._teamsConfig[carClass].colour;
    }

    return colour;
  }

  _getDriverFlag(driverName: string): string {
    driverName = driverName.toLowerCase();
    if (this._driversConfig[driverName]) {
      return this._driversConfig[driverName].flag;
    }

    return null;
  }

  _standingsObservable(): Observable<any> {
    return this.http
      .get(`${this.BASE_URL}/standings`)
      .map(this._mapResponse)
      .catch(this._handleError);
  }

  _sessionObservable(): Observable<any> {
    return this.http
      .get(`${this.BASE_URL}/sessionInfo`)
      .map(this._mapResponse)
      .catch(this._handleError);
  }

  _resetData(): void {
    this._driverLaps = {};
    this._focusedDriver = null;
    this._overallBestLap = null;
  }

  _mapResponse(response: Response): any {
    return response.json();
  }

  _handleError(error: any): any {
    console.log(error);
  }
}

const sampleSessionData = {
  session: 'PRACTICE1',
  serverName: '',
  maximumLaps: 21,
  trackName: 'Bahrain International Circuit',
  darkCloud: 0.0,
  raining: 0.0,
  ambientTemp: 29.0,
  trackTemp: 29.0,
  endEventTime: 86400.0,
  currentEventTime: 238.0
};

const sampleStandingsData = [
  {
    'position': 9,
    'driverName': 'Kieran Chadwick ',
    'bestLapTime': 110,
    'pitstops': 0,
    'pitting': false,
    'lastLapTime': 0.0,
    'vehicleName': 'Cian White #48',
    'timeBehindNext': 0.0,
    'timeBehindLeader': 0.0,
    'lapsBehindLeader': 2,
    'lapsBehindNext': 1,
    'currentSectorTime1': -1.0,
    'currentSectorTime2': -1.0,
    'lastSectorTime1': 0.0,
    'lastSectorTime2': 0.0,
    'focus': false,
    'carClass': 'Sabre Racing',
    'slotID': 0,
    'carStatus': 'PITTING',
    'lapsCompleted': 0,
    'hasFocus': false
  },
  {
    'position': 5, 'driverName': 'Mattia Silva', 'bestLapTime': -1.0, 'pitstops': 0, 'pitting': false, 'lastLapTime': -1.0,
    'vehicleName': 'Mattia Silva #47', 'timeBehindNext': 0.0, 'timeBehindLeader': 0.0, 'lapsBehindLeader': 1,
    'lapsBehindNext': 1, 'currentSectorTime1': -1.0, 'currentSectorTime2': -1.0, 'lastSectorTime1': -1.0, 'lastSectorTime2': -1.0,
    'focus': false, 'carClass': 'Disruptive Tech Racing', 'slotID': 1, 'carStatus': 'FINISHED', 'lapsCompleted': 1, 'hasFocus': false
  }
];
