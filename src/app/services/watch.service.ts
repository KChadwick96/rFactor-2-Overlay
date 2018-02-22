import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { environment } from '../../environments/environment';

@Injectable()
export class WatchService {

  private baseUrl: String = 'http://localhost:5397/rest/watch';

  constructor(
    private http: Http
  ) {}

  getSession(): Observable<any> {

    // dev mode
    if (!environment.production) {
      return this._getFakeSession();
    }

    return this.http
      .get(`${this.baseUrl}/sessionInfo`)
      .map(this._mapResponse)
      .catch(this._handleError);
  }

  getStandings(): Observable<any> {

    // dev mode
    if (!environment.production) {
      return this._getFakeStandings();
    }

    return this.http
      .get(`${this.baseUrl}/standings`)
      .map(this._mapResponse)
      .catch(this._handleError);
  }

  _getFakeSession(): Observable<any> {
    return Observable.create((observer: Observer<any>) => {
      observer.next(sampleSessionData);
    });
  }

  _getFakeStandings(): Observable<any> {
    return Observable.create((observer: Observer<any>) => {
      observer.next(sampleStandingsData);
    });
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
  {"position":9,"driverName":"Kieran Chadwick ","bestLapTime":-1.0,"pitstops":0,"pitting":true,"lastLapTime":0.0,"vehicleName":"Cian White #48","timeBehindNext":0.0,"timeBehindLeader":0.0,"lapsBehindLeader":2,"lapsBehindNext":1,"currentSectorTime1":-1.0,"currentSectorTime2":-1.0,"lastSectorTime1":0.0,"lastSectorTime2":0.0,"focus":false,"carClass":"Sabre Racing","slotID":0,"carStatus":"PITTING","lapsCompleted":0,"hasFocus":false},
  {"position":5,"driverName":"Mattia Silva","bestLapTime":-1.0,"pitstops":0,"pitting":false,"lastLapTime":-1.0,"vehicleName":"Mattia Silva #47","timeBehindNext":0.0,"timeBehindLeader":0.0,"lapsBehindLeader":1,"lapsBehindNext":1,"currentSectorTime1":-1.0,"currentSectorTime2":-1.0,"lastSectorTime1":-1.0,"lastSectorTime2":-1.0,"focus":true,"carClass":"Disruptive Tech Racing","slotID":1,"carStatus":"FINISHED","lapsCompleted":1,"hasFocus":true},
  {"position":6,"driverName":"AOR Test Driver - Red","bestLapTime":-1.0,"pitstops":0,"pitting":true,"lastLapTime":0.0,"vehicleName":"AOR Test Driver - Red","timeBehindNext":0.0,"timeBehindLeader":0.0,"lapsBehindLeader":2,"lapsBehindNext":1,"currentSectorTime1":-1.0,"currentSectorTime2":-1.0,"lastSectorTime1":0.0,"lastSectorTime2":0.0,"focus":false,"carClass":"AOR Test Team","slotID":2,"carStatus":"PITTING","lapsCompleted":0,"hasFocus":false},
  {"position":10,"driverName":"AOR Test Driver - Silver","bestLapTime":-1.0,"pitstops":0,"pitting":false,"lastLapTime":-1.0,"vehicleName":"AOR Test Driver - Silver","timeBehindNext":0.0,"timeBehindLeader":0.0,"lapsBehindLeader":1,"lapsBehindNext":0,"currentSectorTime1":33.345458984375,"currentSectorTime2":-1.0,"lastSectorTime1":-1.0,"lastSectorTime2":-1.0,"focus":false,"carClass":"AOR Test Team","slotID":3,"carStatus":"DNF","lapsCompleted":1,"hasFocus":false},
  {"position":3,"driverName":"AOR Test Driver - Yellow","bestLapTime":104.36524963378906,"pitstops":0,"pitting":false,"lastLapTime":104.36524963378906,"vehicleName":"AOR Test Driver - Yellow","timeBehindNext":69.04061126708984,"timeBehindLeader":12.173198699951172,"lapsBehindLeader":0,"lapsBehindNext":0,"currentSectorTime1":-1.0,"currentSectorTime2":-1.0,"lastSectorTime1":33.46806335449219,"lastSectorTime2":79.11146545410156,"focus":false,"carClass":"AOR Test Team","slotID":4,"carStatus":"FINISHED","lapsCompleted":2,"hasFocus":false},
  {"position":1,"driverName":"Sam Carpenter","bestLapTime":102.99269104003906,"pitstops":0,"pitting":false,"lastLapTime":102.99269104003906,"vehicleName":"Sam Carpenter #46","timeBehindNext":0.0,"timeBehindLeader":0.0,"lapsBehindLeader":0,"lapsBehindNext":0,"currentSectorTime1":33.90283203125,"currentSectorTime2":-1.0,"lastSectorTime1":33.18882751464844,"lastSectorTime2":77.81517028808594,"focus":false,"carClass":"Sabre Racing","slotID":5,"carStatus":"DNF","lapsCompleted":2,"hasFocus":false},{"position":8,"driverName":"Tino Naukkarinen","bestLapTime":-1.0,"pitstops":0,"pitting":false,"lastLapTime":-1.0,"vehicleName":"Tino Naukkarinen #10","timeBehindNext":0.0,"timeBehindLeader":67.22758483886719,"lapsBehindLeader":0,"lapsBehindNext":0,"currentSectorTime1":32.540618896484375,"currentSectorTime2":-1.0,"lastSectorTime1":-1.0,"lastSectorTime2":-1.0,"focus":false,"carClass":"ACR Zakspeed","slotID":6,"carStatus":"DNF","lapsCompleted":1,"hasFocus":false},{"position":2,"driverName":"AOR Test Driver - Black","bestLapTime":103.86192321777344,"pitstops":0,"pitting":false,"lastLapTime":105.26962280273438,"vehicleName":"AOR Test Driver - Black","timeBehindNext":0.0,"timeBehindLeader":0.0,"lapsBehindLeader":0,"lapsBehindNext":0,"currentSectorTime1":-1.0,"currentSectorTime2":-1.0,"lastSectorTime1":34.29595947265625,"lastSectorTime2":79.72906494140625,"focus":false,"carClass":"AOR Test Team","slotID":7,"carStatus":"FINISHED","lapsCompleted":3,"hasFocus":false},
  {"position":4,"driverName":"AOR Test Driver - Green","bestLapTime":106.20903015136719,"pitstops":0,"pitting":false,"lastLapTime":106.20903015136719,"vehicleName":"AOR Test Driver - Green","timeBehindNext":-60.82139587402344,"timeBehindLeader":-48.648197174072266,"lapsBehindLeader":0,"lapsBehindNext":0,"currentSectorTime1":34.31390380859375,"currentSectorTime2":79.15994262695312,"lastSectorTime1":36.229339599609375,"lastSectorTime2":81.39878845214844,"focus":false,"carClass":"AOR Test Team","slotID":8,"carStatus":"NONE","lapsCompleted":2,"hasFocus":false},{"position":7,"driverName":"Scott Davison","bestLapTime":-1.0,"pitstops":0,"pitting":false,"lastLapTime":0.0,"vehicleName":"Scott Davison #13","timeBehindNext":-74.79524230957031,"timeBehindLeader":0.0,"lapsBehindLeader":1,"lapsBehindNext":0,"currentSectorTime1":-1.0,"currentSectorTime2":-1.0,"lastSectorTime1":0.0,"lastSectorTime2":0.0,"focus":false,"carClass":"Defiance Racing","slotID":9,"carStatus":"NONE","lapsCompleted":0,"hasFocus":false},
  {"position":11,"driverName":"Craig Baxter","bestLapTime":-1.0,"pitstops":0,"pitting":false,"lastLapTime":-1.0,"vehicleName":"Craig Baxter #9","timeBehindNext":-55.17249298095703,"timeBehindLeader":43.16745376586914,"lapsBehindLeader":0,"lapsBehindNext":0,"currentSectorTime1":33.73773193359375,"currentSectorTime2":78.95513916015625,"lastSectorTime1":-1.0,"lastSectorTime2":-1.0,"focus":false,"carClass":"Defiance Racing","slotID":10,"carStatus":"NONE","lapsCompleted":1,"hasFocus":false}
]

