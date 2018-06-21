// TODO: sector state enum
// TODO: rename driverlap interface

import { Injectable } from '@angular/core';
import { sortBy, isEmpty } from 'lodash';

@Injectable()
export class StandingsService {
    private DATA_REFRESH_RATE = 2000;
    private HOLD_LAP_INFO_DELAY = 10000;

    private _currentStandings: Array<ProcessedEntry>;
    private _overallBestLap: Lap;
    private _focusedDriver: ProcessedEntry;

    /**
     * Processes the new entries from RF2
     * @param entries - Raw Entries from RF2
     */
    updateStandings(entries: Array<RawEntry>): Array<ProcessedEntry> {

        entries = sortBy(entries, 'position');

        const processed: Array<ProcessedEntry> = [];
        entries.forEach(entry => {
            const processedEntry = this._processEntry(entry);
            processed.push(processedEntry);
        });

        this._currentStandings = processed;
        return processed;
    }

    /**
     * Takes a raw entry from RF2 and adds any custom fields we need
     * @param entry - Raw RF2 Entry
     */
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

            // gap state + and assign to entry
            const personalBest = isEmpty(previousEntry.bestLap) ? null : previousEntry.bestLap;
            const state = this._getLapState('total', lastLap.total, personalBest);
            const gap = this._gapToBest(entry.lastLapTime);
            processed.gapEvent = {state, gap};

            // is this their pb?
            if (!previousEntry.bestLap || previousEntry.bestLap.total > lastLap.total) {
                processed.bestLap = lastLap;
            }

            // keep the last lap info on screen
            processed.lastLapHold = {
                counter: 0,
                lap: lastLap,
                gap, state
            };

            this._sessionFastestLapCheck(lastLap);
        }

        // update laps checked, lastLapHold and currentLap (if not pitting)
        processed.lapsChecked = entry.lapsCompleted;
        processed.lastLapHold = this._updateLastLapHold(previousEntry);
        processed.currentLap = !entry.pitting ? null : previousEntry.currentLap;

        // have they just completed the 1st or 2nd sector
        /* TODO Some sector calculations */

        // colour, flag and focuseddriver
        processed.col
        if (entry.focus) {
            this._focusedDriver = processed;
        }

        return processed;
    }

    /**
     * Fetches the last entry for the driver passed
     * @param driverName - RF2 Driver Name
     */
    _getLastDriverEntry(driverName: string): ProcessedEntry {
        if (this._currentStandings == null) {
            return null;
        }

        return this._currentStandings.find(entry => entry.raw.driverName === driverName);
    }

    /**
     * Applies default values for the entry
     * @param driverName - RF2 Driver Name
     */
    _applyEntryDefaults(raw: RawEntry): ProcessedEntry {
        return {
            raw,
            lapsChecked: 0
        };
    }

    /**
     * Based on sector and time passed, evaluates whether PB, SB or DOWN
     * @param sectorKey - Sector to evaluate
     * @param current - Sector time in seconds
     * @param personalBest - Personal Best to compare against
     */
    _getLapState(sectorKey: string, current: number, personalBest: Lap): State {
        if (!this._overallBestLap || current < this._overallBestLap[sectorKey]) {
            return State.SessionBest;
        } else if (!personalBest || current < personalBest[sectorKey]) {
            return State.PersonalBest;
        } else {
            return State.Down;
        }
    }

    /**
     * Takes a lapTime and calculates the gap to best e.g. +1.234
     * @param lapTime - Lap time in seconds to compare against best
     */
    _gapToBest(lapTime: number): string {
        let gapValue = 0;
        if (!isEmpty(this._overallBestLap)) {
            gapValue = lapTime - this._overallBestLap.total;
        }
        return (gapValue > 0 ? '+' : '') + gapValue.toFixed(3);
    }

    /**
     * If session fastest lap, update overallBestLap
     * @param lap - Lap to check
     */
    _sessionFastestLapCheck(lap: Lap) {
        if (isEmpty(this._overallBestLap) || this._overallBestLap.total > lap.total) {
            this._overallBestLap = lap;
        }
    }

    /**
     * Are we still showing last lap info
     * @param entry - Entry to check last lap hold
     */
    _updateLastLapHold(entry: ProcessedEntry): any {
        const hold = entry.lastLapHold;
        if (!hold || hold.counter > this.HOLD_LAP_INFO_DELAY) {
            return null;
        }

        // valid hold so increase counter
        hold.counter += this.DATA_REFRESH_RATE;
        return hold;
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
    readonly focus: boolean;
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
    gapEvent?: GapEvent;
    lastLapHold?: LapHold;
    colour?: string;
    flag?: string;
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
    gap: string;
}

interface LapHold {
    lap: Lap;
    counter: number;
    gap: string;
    state: State;
}

enum State {
    SessionBest = 'SESSION_BEST',
    PersonalBest = 'PERSONAL_BEST',
    Down = 'DOWN'
}
