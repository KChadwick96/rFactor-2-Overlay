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
        'defiance racing': {
            'colour': '#a000d2'
        },
        'sabre racing': {
            'colour': '#07b5f1'
        },
        'krt': {
            'colour': '#e01b25'
        },
        'vulcan racing': {
            'colour': '#ba0000'
        },
        'acr zakspeed': {
            'colour': '#002F7C'
        },
        'zesty racing': {
            'colour': '#ff8a00'
        },
        'drillers motorsport': {
            'colour': '#424542'
        },
        's2 racing': {
            'colour': '#083789'
        },
        'schubert motorsport': {
            'colour': '#C40000'
        },
        'ferslev racing team': {
            'colour': '#CECFCE'
        },
        'royal blue racing': {
            'colour': '#1344b5'
        },
        'race clutch': {
            'colour': '#BE352B',
        },
        'thrive esports black': {
            'colour': '#2ee3d3'
        },
        'visceral sim racing': {
            'colour': '#0E0D0E'
        },
        'covadis racing': {
            'colour': '#E27D24'
        },
        'eleven ballast racing': {
            'colour': '#F8DE01'
        },
        'cor racing': {
            'colour': '#c0c0c0'
        },
        'wolf racing': {
            'colour': '#f5f5f5'
        },
        'thrive esports blue': {
            'colour': '#141455'
        }
    },
    drivers: {
        'craig baxter': {
            'flag': 'https://imgur.com/0apJFaG.png'
        },
        'scott davison': {
            'flag': 'https://imgur.com/4yAOniI.png'
        },
        'sam carpenter': {
            'flag': 'https://imgur.com/4yAOniI.png'
        },
        'cian white': {
            'flag': 'https://imgur.com/Wno1zTe.png'
        },
        'kieran chadwick': {
            'flag': 'https://imgur.com/4yAOniI.png'
        },
        'evan rice': {
            'flag': 'https://imgur.com/lqEcsyy.png'
        },
        'mac shepherd': {
            'flag': 'https://imgur.com/4yAOniI.png'
        },
        'kevin cox': {
            'flag': 'https://imgur.com/4yAOniI.png'
        },
        'ross woodford': {
            'flag': 'https://imgur.com/4yAOniI.png'
        },
        'tino naukkarinen': {
            'flag': 'https://imgur.com/VIJffgO.png'
        },
        'dan-ove brantholm': {
            'flag': 'https://imgur.com/pnoBMKg.png'
        },
        'philip kraus': {
            'flag': 'https://imgur.com/lqEcsyy.png'
        },
        'adam cronin': {
            'flag': 'https://imgur.com/4yAOniI.png'
        },
        'jordy zwiers': {
            'flag': 'https://imgur.com/fhXmGJQ.png'
        },
        'brandon ohenlen': {
            'flag': 'https://imgur.com/uXTuiD0.png'
        },
        'dominic lambrechts': {
            'flag': 'https://imgur.com/4yAOniI.png'
        },
        'jacob reid': {
            'flag': 'https://imgur.com/4yAOniI.png'
        },
        'dionysis faraos': {
            'flag': 'https://imgur.com/YsHTDTe.png'
        },
        'asger hebsgaard': {
            'flag': 'https://imgur.com/sffO9eY.png'
        },
        'lasse sorensen': {
            'flag': 'https://imgur.com/sffO9eY.png'
        },
        'tomi ylitalo': {
            'flag': 'https://imgur.com/VIJffgO.png'
        },
        'callum roberts': {
            'flag': 'https://imgur.com/4yAOniI.png'
        },
        'eneric andre': {
            'flag': 'https://imgur.com/o3kblwK.png'
        },
        'robin bondon': {
            'flag': 'https://imgur.com/o3kblwK.png'
        },
        'kevin turner': {
            'flag': 'https://imgur.com/wfwSvVC.png'
        },
        'noah chilla': {
            'flag': 'https://imgur.com/uXTuiD0.png'
        },
        'jukkapekka lalu': {
            'flag': 'https://imgur.com/VIJffgO.png'
        },
        'rik van doorn': {
            'flag': 'https://imgur.com/fhXmGJQ.png'
        },
        'daniel cermak': {
            'flag': 'https://imgur.com/NW1W2Xq.png'
        },
        'thomas lagny': {
            'flag': 'https://imgur.com/o3kblwK.png'
        },
        'damian hall': {
            'flag': 'https://imgur.com/wfwSvVC.png'
        },
        'jeff jacobs': {
            'flag': 'https://imgur.com/x9Cp0mK.png'
        },
        'david pashkovski': {
            'flag': 'https://imgur.com/3oTIESg.png'
        },
        'mathias guldager': {
            'flag': 'https://imgur.com/sffO9eY.png'
        }
    }
};
