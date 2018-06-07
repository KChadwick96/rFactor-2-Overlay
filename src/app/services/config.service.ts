import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { environment } from '../../environments/environment';

@Injectable()
export class ConfigService {

    private _config: Object = null;

    constructor(private http: Http) {}

    public get(key: string): any {
        if (!this._config) {
            throw new Error('Cannot fetch config parameter when no config is loaded');
        }

        return this._config[key];
    }

    public load(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.http.get(environment.settings_url).map(res => res.json()).catch((error: any): any => {
                console.log('Failed to load config file');
                reject(error);
            }).subscribe(response => {
                this._config = response;
                resolve();
            });
        });
    }
}
