import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'sessionName' })
export class SessionNamePipe implements PipeTransform {

    private _sessionMapping = [{
        key: 'PRACTICE1',
        full: 'Practice 1',
        abbreviated: 'P1'
    }, {
        key: 'PRACTICE2',
        full: 'Qualifying 1',
        abbreviated: 'Q1'
    }, {
        key: 'PRACTICE3',
        full: 'Practice 3',
        abbreviated: 'P3'
    }, {
        key: 'WARMUP',
        full: 'Warmup',
        abbreviated: 'WU'
    }, {
        key: 'QUALIFY1',
        full: 'Qualifying 2',
        abbreviated: 'Q2'
    }, {
        key: 'QUALIFY2',
        full: 'Qualifying 2',
        abbreviated: 'Q2'
    }];

    transform(key: string, type: string): string {
        type = type.toLowerCase();
        const session = this._sessionMapping.find(map => map.key === key);

        if (session) {
            return session[type];
        } else {
            return '-';
        }
    }
}
