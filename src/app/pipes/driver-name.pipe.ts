import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'driverName' })
export class DriverNamePipe implements PipeTransform {
    transform(name: string, type: string): string {

        // get last part
        const parts = name.trim().split(' ');
        const last = parts[parts.length - 1];

        // return 
        type = type.toLowerCase();
        if (type === 'last') {
            return last
        } else if (type === 'full') {
            parts.pop();
            return `${parts.join(' ')} ${last.toUpperCase()}`;
        } else if (type === 'abbreviated') {
            return last.substring(0, 3);
        }
    }
}