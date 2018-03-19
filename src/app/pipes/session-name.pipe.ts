import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'sessionName' })
export class SessionNamePipe implements PipeTransform {
    transform(name: string, type: string): string {
        type = type.toLowerCase();

        let session = '';
        switch (name) {
            case 'PRACTICE1':
                if (type === 'full') session = 'Practice 1';
                if (type === 'abbreviated') session = 'P1';
                break;

            case 'PRACTICE2':
                if (type === 'full') session = 'Practice 2';
                if (type === 'abbreviated') session = 'P2';
                break;

            case 'PRACTICE3':
                if (type === 'full') session = 'Practice 3';
                if (type === 'abbreviated') session = 'P3';
                break;

            case 'QUALIFY1':
                if (type === 'full') session = 'Qualifying 1';
                if (type === 'abbreviated') session = 'Q1';
                break;

            case 'QUALIFY2':
                if (type === 'full') session = 'Qualifying 2';
                if (type === 'abbreviated') session = 'Q2';
                break;

            case 'QUALIFY3':
                if (type === 'full') session = 'Qualifying 3';
                if (type === 'abbreviated') session = 'Q3';
                break;
        }

        return session;
    }
}