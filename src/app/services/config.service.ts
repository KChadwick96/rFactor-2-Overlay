import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { environment } from '../../environments/environment';

@Injectable()
export class ConfigService {

    private baseUrl: string = 'http://localhost:5397/rest/watch';

    constructor(
        private http: Http
    ) {}

    getTeamsConfig(): Object {
        return fakeTeamConfig;
    }
}


const fakeTeamConfig = {
    "krt": {
        "colour": "#e01b25"
    },
    "sabre racing": {
        "colour": "#07b5f1"
    },
    "defiance racing": {
        "colour": "#a000d2"
    },
    "disruptive tech racing": {
        "colour": "#3c3c3d"
    },
    "acr zakspeed": {
        "colour": "#e8e8e8"
    },
    "zesty racing": {
        "colour": "#e28c28"
    },
    "idos motorsport": {
        "colour": "#000000"
    },
    "vi race team": {
        "colour": "#e5e5e5"
    },
    "s2 racing": {
        "colour": "#002b91"
    }
}