// TODO: sector state enum
// TODO: rename driverlap interface

import { Injectable } from '@angular/core';
import { sortBy, slice } from 'lodash';

@Injectable()
export class StandingsService {
    private MAX_ENTRIES = 20;

    private _currentStandings: Array<ProcessedEntry>;
    private _overallBestLap: Lap;

    updateStandings(entries: Array<RawEntry>): void {

        // sort by position and trim to MAX_ENTRIES + 1
        // since we need data for the entry below max
        entries = sortBy(entries, 'position');
        // entries = slice(entries, 0, this.MAX_ENTRIES + 1);

        const processed: Array<ProcessedEntry> = [];
        entries.forEach(entry => {
            const processedEntry = this._processEntry(entry);
            processed.push(processedEntry);
        });

        this._currentStandings = processed;
    }

    _processEntry(entry: RawEntry): ProcessedEntry {
        const previousEntry = this._getLastDriverEntry(entry.driverName);

        if (!previousEntry) {
            return this._applyEntryDefaults(entry);
        }

        const processed: ProcessedEntry = {
            raw: entry,
            lapsChecked: previousEntry.lapsChecked
        };

        // driver just completed a lap
        if (entry.lapsCompleted - previousEntry.lapsChecked === 1 && entry.lastLapTime > -1) {

            // current lap data on previous entry holds last lap data now
            const lastLap = previousEntry.currentLap;
            lastLap.sector3 = previousEntry.raw.lastLapTime - previousEntry.raw.lastSectorTime2;
            lastLap.sector3State = this._getLapState('sector3', lastLap.sector3, previousEntry.bestLap);
            processed.lastLap = lastLap;
            processed.currentLap = null;







            

            // get last lap and use previously calculated sector states
            //const lastLap = this._getLastLap(entry, driverLap);
            //lastLap.sector_1_state = driverLap.sector_1_state;
            //lastLap.sector_2_state = driverLap.sector_2_state;
            //driverLap.sector_1_state = driverLap.sector_2_state = null;

            // gap state + and assign to entry
            const personalBest = (isEmpty(driverLap.best_lap)) ? null : driverLap.best_lap.total;
            const state = this._getLapState('total', lastLap.total, personalBest);
            const gap = this._gapToBest(entry.lastLapTime);
            entry.gapEvent = {state, gap};

            // is this their pb?
            if (driverLap.best_lap === null || driverLap.total > lastLap.total) {
                driverLap.best_lap = lastLap;
            }

            // keep the last lap info on screen
            /*driverLap.last_lap_hold = {counter: 0, lastLap, gap, state};

            this._sessionFastestLapCheck(lastLap); */
        }
        
        return {
            raw: entry,
            lapsChecked: 0
        }
    }

    _getLastDriverEntry(driverName: string): ProcessedEntry {
        if (this._currentStandings == null) {
            return null;
        }

        return this._currentStandings.find(entry => entry.raw.driverName === driverName);
    }

    _applyEntryDefaults(raw: RawEntry): ProcessedEntry {
        return {
            raw,
            lapsChecked: 0
        }
    }

    _getLapState(sectorKey: string, current: number, personalBestLap: Lap): State {
        if (!this._overallBestLap || current < this._overallBestLap[sectorKey]) {
            return State.SessionBest;
        } else if (!personalBestLap || current < personalBestLap[sectorKey]) {
            return State.PersonalBest;
        } else {
            return State.Down;
        }
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
    bestLap?: Lap;
    currentLap?: Lap;
    lastLap?: Lap;
}

interface Lap {
    sector1: number;
    sector1State: State;
    sector2: number;
    sector2State: State;
    sector3: number;
    sector3State: State;
    total: number;
}

interface GapEvent {
    state: State;
    gap: number;
}

enum State {
    SessionBest = 'SESSION_BEST',
    PersonalBest = 'PERSONAL_BEST',
    Down = 'DOWN'
}