import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {

    constructor() {}

    getConfig(): any {
        return config;
    }
}

const config = {
    teams: {
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
    },
    drivers: {
        "kieran chadwick": {
            "flag": "https://imgur.com/4yAOniI.png"
        },
        "craig baxter": {
            "flag": "https://imgur.com/0apJFaG.png"
        },
        "scott davison": {
            "flag": "https://imgur.com/4yAOniI.png"
        },
        "evan rice": {
            "flag": "https://imgur.com/lqEcsyy.png"
        },
        "sam carpenter": {
            "flag": "https://imgur.com/4yAOniI.png"
        },
        "cian white": {
            "flag": "https://imgur.com/Wno1zTe.png"
        },
        "mac shepherd": {
            "flag": "https://imgur.com/4yAOniI.png"
        },
        "kevin cox": {
            "flag": "https://imgur.com/4yAOniI.png"
        },
        "ross woodford": {
            "flag": "https://imgur.com/4yAOniI.png"
        },
        "tino naukkarinen": {
            "flag": "https://imgur.com/VIJffgO.png"
        }
    }
}

// barbados  https://imgur.com/wfwSvVC.png
// canada https://imgur.com/wfwSvVC.png
// estonia https://imgur.com/lQY7jwt
// usa https://imgur.com/lqEcsyy
// finland https://imgur.com/VIJffgO
// france https://imgur.com/o3kblwK
// germany https://imgur.com/uXTuiD0
// czech https://imgur.com/NW1W2Xq
// ireland https://imgur.com/Wno1zTe
// italy https://imgur.com/isyV4ka
// lithuania https://imgur.com/MUamoPt
// greece https://imgur.com/YsHTDTe
// south africa https://imgur.com/6q7RieM
// spain https://imgur.com/kWjTroJ
// netherlands https://imgur.com/fhXmGJQ
// portugal https://imgur.com/i7q5I4M
// sweden https://imgur.com/pnoBMKg
// uk https://imgur.com/4yAOniI
// uruguay https://imgur.com/uySRbrm
// scotland https://imgur.com/0apJFaG