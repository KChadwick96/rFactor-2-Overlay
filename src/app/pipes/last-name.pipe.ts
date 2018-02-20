import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'lastName' })
export class LastNamePipe implements PipeTransform {
    transform(name: String):string {
        const parts = name.trim().split(' ');
        return parts[parts.length - 1];
    }
}