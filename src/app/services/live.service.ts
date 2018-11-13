import { Injectable } from '@angular/core';
import { Jsonp } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LiveService {

    private DATA_REFRESH_RATE = 5000;
    //private BASE_URL = 'http://176.9.64.2:8002/';
    private BASE_URL = 'http://176.9.64.2:8000/live/get_full_server_data_jsonp?callback=JSONP_CALLBACK';

    constructor(
        private jsonp: Jsonp
    ) {}

    start(): void {
        setInterval(() => {
            this._fetch();
        }, this.DATA_REFRESH_RATE);
    }

    _fetch(): void {
        this._dataObservable().subscribe(data => {
            if (data.server_names_list.length === 0) {
                return;
            }

            const serverName = data.server_names_list[0];
            const serverData = data.server_data[serverName];

            console.log(serverData);
        });
    }

    _dataObservable(): Observable<any> {
        return this.jsonp
            .request(`${this.BASE_URL}`)
            .map(response => response.json())
            .catch(this._handleError);
    }

  _handleError(error: any): any {
    console.log(error);
  }
}
