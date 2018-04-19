// TODO: sector state enum
// TODO: rename driverlap interface

import { Injectable } from '@angular/core';
import { sortBy, slice } from 'lodash';

@Injectable()
export class StandingsService {
    private MAX_ENTRIES = 20;

    private _currentStandings: Array<ProcessedEntry>;
    private _driverLaps: Array<DriverLap>;

    updateStandings(entries: Array<RawEntry>): void {

        // sort by position and trim to MAX_ENTRIES + 1
        // since we need data for the entry below max
        entries = sortBy(entries, 'position');
        //entries = slice(entries, 0, this.MAX_ENTRIES + 1);

        const processed: Array<ProcessedEntry> = [];
        entries.forEach(entry => {
            const processedEntry = this._processEntry(entry);
            processed.push(processedEntry);
        });

        this._currentStandings = processed;
    }

    _processEntry(entry: RawEntry): ProcessedEntry {
        const previousEntry = this._getLastDriverEntry(entry.driverName);

        if (entry.lapsCompleted - previousEntry.lapsChecked)

        // do something
        
        return {
            raw: entry
        }
    }

    _getLastDriverEntry(driverName: string): ProcessedEntry {
        if (this._currentStandings == null) {
            return null;
        }

        return this._currentStandings.find(entry => entry.raw.driverName === driverName);
    }
}

interface RawEntry {
    readonly position: number;
    readonly driverName: string;
    readonly bestLapTime: number;
    readonly pitstops: number;
    readonly pitting: boolean;
    readonly lastLapTime: number;
    readonly vehicleName: string;
    readonly timeBehindNext: number;
    readonly timeBehindLeader: number;
    readonly lapsBehindLeader: number;
    readonly lapsBehindNext: number;
    readonly currentSectorTime1: number;
    readonly currentSectorTime2: number;
    readonly lastSectorTime1: number;
    readonly lastSectorTime2: number;
    readonly focus: number;
    readonly carClass: string;
    readonly slotID: number;
    readonly carStatus: string;
    readonly lapsCompleted: number;
    readonly hasFocus: boolean;
}

interface ProcessedEntry {
    raw: RawEntry;
    lapsChecked: number;
    gapEvent?: GapEvent;

}

interface GapEvent {
    state: string;
    gapToBest: string;
}

interface DriverLap {
    bestLap: Lap;
    sector1State: string;
    sector2State: string;
}

interface Lap {
    sector1: number;
    sector1State: null;
    sector2: number;
    sector2State: null;
    sector3: number;
    sector3State: string;
    total: number;
}

enum State {
    SessionBest,
    PersonalBest,
    Down
}