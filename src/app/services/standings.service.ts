import { Injectable } from '@angular/core';
import { sortBy, slice } from 'lodash';

@Injectable()
export class StandingsService {
    private MAX_ENTRIES = 20;

    private _driverLaps: Array<IDriverLap>;

    updateStandings(entries: Array<IEntry>): void {

        // sort by position and trim to MAX_ENTRIES + 1
        // since we need data for the entry below max
        entries = sortBy(entries, 'position');
        entries = slice(entries, 0, this.MAX_ENTRIES + 1);

        // entries.forEach(this._processEntry);
    }

    _processEntry(entry: IEntry): void {
        // do something
    }
}

interface IEntry {
    position: number;
    driverName: string;
    bestLapTime: number;
    pitstops: number;
    pitting: boolean;
    lastLapTime: number;
    vehicleName: string;
    timeBehindNext: number;
    timeBehindLeader: number;
    lapsBehindLeader: number;
    lapsBehindNext: number;
    currentSectorTime1: number;
    currentSectorTime2: number;
    lastSectorTime1: number;
    lastSectorTime2: number;
    focus: number;
    carClass: string;
    slotID: number;
    carStatus: string;
    lapsCompleted: number;
    hasFocus: boolean;
}

interface IDriverLap {
    best_lap: number;
    laps_checked: number;
    sector_1_state: string;
    sector_2_state: string;
}
