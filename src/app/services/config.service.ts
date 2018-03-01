import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {

    constructor() {}

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