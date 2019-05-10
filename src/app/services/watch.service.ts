import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { StandingsService } from './standings.service';
import { environment } from '../../environments/environment';

@Injectable()
export class WatchService {

  private DATA_REFRESH_RATE = 1000;
  private BASE_URL = 'http://localhost:5397/rest/watch';

  private _sessionData: any;

  constructor(
    private http: Http,
    private standingsService: StandingsService
  ) {}

  session(): Observable<any> {
    this.standingsService.init();

    // fetch session data
    if (environment.production) {
      setInterval(() => {
        this._sessionObservable().subscribe(session => {

          // reset standings if new session
          if (this._sessionData && this._sessionData.session !== session.session) {
            this.standingsService.reset();
          }

          this._sessionData = session;
        });
      }, this.DATA_REFRESH_RATE);
    }

    return Observable.create(observer => {
      setInterval(() => {

        // test data
        if (!environment.production) {
          this.standingsService.updateStandings(sampleStandingsData);
          return observer.next({
            session_info: sampleSessionData,
            standings: this.standingsService.currentStandings,
            focused_driver: this.standingsService.focusedDriver,
            overall_best_lap: this.standingsService.overallBestLap,
            sector_flags: this.standingsService.sectorFlags
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
          this.standingsService.updateStandings(standings);
          const data = {
            session_info: this._sessionData,
            standings: this.standingsService.currentStandings,
            focused_driver: this.standingsService.focusedDriver,
            overall_best_lap: this.standingsService.overallBestLap,
            sector_flags: this.standingsService.sectorFlags
          };
          observer.next(data);
        });
      }, this.DATA_REFRESH_RATE);
    });
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
    'position': 1,
    'driverName': 'Kieran Chadwick ',
    'bestLapTime': 110,
    'pitstops': 0,
    'pitting': true,
    'lastLapTime': 0.0,
    'vehicleName': '16LM JBM Racing eSports GT #123',
    'timeBehindNext': 0.0,
    'timeBehindLeader': 0.0,
    'lapsBehindLeader': 2,
    'lapsBehindNext': 1,
    'currentSectorTime1': -1.0,
    'currentSectorTime2': -1.0,
    'lastSectorTime1': 0.0,
    'lastSectorTime2': 0.0,
    'focus': true,
    'carClass': 'Sabre Racing',
    'slotID': 0,
    'carStatus': 'PITTING',
    'lapsCompleted': 0,
    'hasFocus': true,
    'inControl': 'PLAYER'
  },
  {
    'position': 3, 'driverName': 'Mattia Salva', 'bestLapTime': -1.0, 'pitstops': 0, 'pitting': true, 'lastLapTime': -1.0,
    'vehicleName': '16LM Shattered Windshield Racing', 'timeBehindNext': 0.0, 'timeBehindLeader': 0.0, 'lapsBehindLeader': 1,
    'lapsBehindNext': 1, 'currentSectorTime1': -1.0, 'currentSectorTime2': -1.0, 'lastSectorTime1': -1.0, 'lastSectorTime2': -1.0,
    'focus': false, 'carClass': 'Disruptive Tech Racing', 'slotID': 1, 'carStatus': 'FINISHED', 'lapsCompleted': 1, 'hasFocus': false,
    'inControl': 'REMOTE'
  },
  {
    'position': 4, 'driverName': 'Mattia Sblva', 'bestLapTime': -1.0, 'pitstops': 0, 'pitting': false, 'lastLapTime': -1.0,
    'vehicleName': 'Mattia Silva #47', 'timeBehindNext': 0.0, 'timeBehindLeader': 0.0, 'lapsBehindLeader': 1,
    'lapsBehindNext': 1, 'currentSectorTime1': -1.0, 'currentSectorTime2': -1.0, 'lastSectorTime1': -1.0, 'lastSectorTime2': -1.0,
    'focus': false, 'carClass': 'Disruptive Tech Racing', 'slotID': 1, 'carStatus': 'FINISHED', 'lapsCompleted': 1, 'hasFocus': false,
    'inControl': 'REMOTE'
  },
  {
    'position': 5, 'driverName': 'Mattia Sclva', 'bestLapTime': -1.0, 'pitstops': 0, 'pitting': false, 'lastLapTime': -1.0,
    'vehicleName': 'Mattia Silva #47', 'timeBehindNext': 185.4, 'timeBehindLeader': 0.0, 'lapsBehindLeader': 1,
    'lapsBehindNext': 0, 'currentSectorTime1': -1.0, 'currentSectorTime2': -1.0, 'lastSectorTime1': -1.0, 'lastSectorTime2': -1.0,
    'focus': false, 'carClass': 'Disruptive Tech Racing', 'slotID': 1, 'carStatus': 'FINISHED', 'lapsCompleted': 1, 'hasFocus': false,
    'inControl': 'REMOTE'
  },
  {
    'position': 6, 'driverName': 'Mattia Sdlva', 'bestLapTime': -1.0, 'pitstops': 0, 'pitting': false, 'lastLapTime': -1.0,
    'vehicleName': 'Mattia Silva #47', 'timeBehindNext': 0.0, 'timeBehindLeader': 0.0, 'lapsBehindLeader': 1,
    'lapsBehindNext': 1, 'currentSectorTime1': -1.0, 'currentSectorTime2': -1.0, 'lastSectorTime1': -1.0, 'lastSectorTime2': -1.0,
    'focus': false, 'carClass': 'Disruptive Tech Racing', 'slotID': 1, 'carStatus': 'FINISHED', 'lapsCompleted': 1, 'hasFocus': false,
    'inControl': 'REMOTE'
  },
  {
    'position': 7, 'driverName': 'Mattia Selva', 'bestLapTime': -1.0, 'pitstops': 0, 'pitting': false, 'lastLapTime': -1.0,
    'vehicleName': 'Mattia Silva #47', 'timeBehindNext': 0.0, 'timeBehindLeader': 0.0, 'lapsBehindLeader': 1,
    'lapsBehindNext': 1, 'currentSectorTime1': -1.0, 'currentSectorTime2': -1.0, 'lastSectorTime1': -1.0, 'lastSectorTime2': -1.0,
    'focus': false, 'carClass': 'Disruptive Tech Racing', 'slotID': 1, 'carStatus': 'FINISHED', 'lapsCompleted': 1, 'hasFocus': false,
    'inControl': 'REMOTE'
  },
  {
    'position': 8, 'driverName': 'Mattia Sklva', 'bestLapTime': -1.0, 'pitstops': 0, 'pitting': false, 'lastLapTime': -1.0,
    'vehicleName': 'Mattia Silva #47', 'timeBehindNext': 0.0, 'timeBehindLeader': 0.0, 'lapsBehindLeader': 1,
    'lapsBehindNext': 1, 'currentSectorTime1': -1.0, 'currentSectorTime2': -1.0, 'lastSectorTime1': -1.0, 'lastSectorTime2': -1.0,
    'focus': false, 'carClass': 'Disruptive Tech Racing', 'slotID': 1, 'carStatus': 'FINISHED', 'lapsCompleted': 1, 'hasFocus': false,
    'inControl': 'REMOTE'
  },
  {
    'position': 9, 'driverName': 'Mattia Splva', 'bestLapTime': -1.0, 'pitstops': 0, 'pitting': false, 'lastLapTime': -1.0,
    'vehicleName': 'Mattia Silva #47', 'timeBehindNext': 0.0, 'timeBehindLeader': 0.0, 'lapsBehindLeader': 1,
    'lapsBehindNext': 1, 'currentSectorTime1': -1.0, 'currentSectorTime2': -1.0, 'lastSectorTime1': -1.0, 'lastSectorTime2': -1.0,
    'focus': false, 'carClass': 'Disruptive Tech Racing', 'slotID': 1, 'carStatus': 'FINISHED', 'lapsCompleted': 1, 'hasFocus': false,
    'inControl': 'REMOTE'
  },
  {
    'position': 10, 'driverName': 'Mattia Svlva', 'bestLapTime': -1.0, 'pitstops': 0, 'pitting': false, 'lastLapTime': -1.0,
    'vehicleName': 'Mattia Silva #47', 'timeBehindNext': 0.0, 'timeBehindLeader': 0.0, 'lapsBehindLeader': 1,
    'lapsBehindNext': 1, 'currentSectorTime1': -1.0, 'currentSectorTime2': -1.0, 'lastSectorTime1': -1.0, 'lastSectorTime2': -1.0,
    'focus': false, 'carClass': 'Disruptive Tech Racing', 'slotID': 1, 'carStatus': 'FINISHED', 'lapsCompleted': 1, 'hasFocus': false,
    'inControl': 'REMOTE'
  },
  {
    'position': 11, 'driverName': 'Mattia SRlva', 'bestLapTime': -1.0, 'pitstops': 0, 'pitting': false, 'lastLapTime': -1.0,
    'vehicleName': 'Mattia Silva #47', 'timeBehindNext': 0.0, 'timeBehindLeader': 0.0, 'lapsBehindLeader': 1,
    'lapsBehindNext': 1, 'currentSectorTime1': -1.0, 'currentSectorTime2': -1.0, 'lastSectorTime1': -1.0, 'lastSectorTime2': -1.0,
    'focus': false, 'carClass': 'Disruptive Tech Racing', 'slotID': 1, 'carStatus': 'FINISHED', 'lapsCompleted': 1, 'hasFocus': false,
    'inControl': 'REMOTE'
  }
];

// TODO: figure out what to do with this old endurance specific code
// remove 16LM from endurance car team names
/* if (this._theme === 'endurance' && entry.vehicleName.startsWith('16LM')) {
  const vehicleNameParts = entry.vehicleName.split(' ');
  vehicleNameParts.shift();
  if (vehicleNameParts[vehicleNameParts.length - 1].startsWith('#')) {
    const number = vehicleNameParts.pop();
    entry.car_number = number.substring(1);
  }

  entry.vehicleName = vehicleNameParts.join(' ');
} */
