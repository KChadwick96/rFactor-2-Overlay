import { Injectable } from '@angular/core';
import { sortBy, isEmpty } from 'lodash';

import { ConfigService } from './config.service';
import { Entry, ProcessedEntry, Lap, State } from '../interfaces';

@Injectable()
export class StandingsService {
    private DATA_REFRESH_RATE = 2000;
    private HOLD_LAP_INFO_DELAY = 10000;

    private _teamsConfig: any;
    private _driversConfig: any;
    private _currentStandings: Array<ProcessedEntry>;
    private _overallBestLap: Lap;
    private _focusedDriver: ProcessedEntry;

    get currentStandings(): Array<ProcessedEntry> {
        return this._currentStandings;
    }

    get overallBestLap(): Lap {
        return this._overallBestLap;
    }

    get focusedDriver(): ProcessedEntry {
        return this._focusedDriver;
    }

    constructor(private config: ConfigService) {}

    /**
     * Loads config info so we don't have to refetch on each cycle
     */
    init(): void {
        this.reset();
        this._teamsConfig = this.config.get('teams');
        this._driversConfig = this.config.get('drivers');
    }

    /**
     * Processes the new entries from RF2
     * @param entries - Raw Entries from RF2
     */
    updateStandings(entries: Array<Entry>): void {

        entries = sortBy(entries, 'position');

        const processed: Array<ProcessedEntry> = [];
        entries.forEach(entry => {
            const processedEntry = this._processEntry(entry);
            processed.push(processedEntry);
        });

        this._currentStandings = processed;
    }

    /**
     * Resets stored data
     */
    reset(): void {
        this._currentStandings = [];
        this._focusedDriver = null;
        this._overallBestLap = null;
    }

    /**
     * Takes a raw entry from RF2 and adds any custom fields we need
     * @param entry - Raw RF2 Entry
     */
    _processEntry(entry: Entry): ProcessedEntry {
        const previousEntry = this._getLastDriverEntry(entry.driverName);

        if (!previousEntry) {
            return this._applyEntryDefaults(entry);
        }

        const processed = {...previousEntry, ...entry};

        processed.gapToLeader = this._gapToBest(entry.bestLapTime);

        // driver just completed a lap
        if (entry.lapsCompleted - previousEntry.lapsChecked === 1 && entry.lastLapTime > -1) {

            // current lap data on previous entry holds last lap data now
            const lastLap = previousEntry.currentLap;
            lastLap.sector3 = entry.lastLapTime - entry.lastSectorTime2;
            lastLap.sector3State = this._getLapState('sector3', lastLap.sector3, previousEntry.bestLap);
            lastLap.total = entry.lastLapTime;
            processed.lastLap = lastLap;

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

            processed.currentLap = this._getEmptyLap();
        }

        // update laps checked, lastLapHold and currentLap (if not pitting)
        processed.lapsChecked = entry.lapsCompleted;
        processed.lastLapHold = this._updateLastLapHold(processed);

        // have they just completed the 1st or 2nd sector
        if (entry.currentSectorTime1 !== -1 && entry.currentSectorTime2 !== -1) {

            // sector 2 completed
            let gapValue = 0;
            if (!isEmpty(this._overallBestLap)) {
                gapValue = entry.currentSectorTime2 - (this._overallBestLap.sector1 + this._overallBestLap.sector2);
            }
            const gap = (gapValue > 0 ? '+' : '') + gapValue.toFixed(3);

            // gap state + and assign to entry
            const state = this._getLapState('sector2', entry.currentSectorTime2, previousEntry.bestLap);
            processed.gapEvent = {state, gap};
            processed.currentLap.sector2State = state;
            processed.currentLap.sector2 = entry.currentSectorTime2 - entry.currentSectorTime1;
        } else if (entry.currentSectorTime1 !== -1) {

            // sector 1 completed
            const gapValue = isEmpty(this._overallBestLap) ? 0 : entry.currentSectorTime1 - this._overallBestLap.sector1;
            const gap = (gapValue > 0 ? '+' : '') + gapValue.toFixed(3);

            // gap state + and assign to entry
            const state = this._getLapState('sector1', entry.currentSectorTime1, previousEntry.bestLap);
            processed.gapEvent = {state, gap};

            processed.currentLap.sector1State = state;
            processed.currentLap.sector1 = entry.currentSectorTime1;
        }

        // colour, flag and focuseddriver
        processed.colour = this._getTeamColour(entry.carClass);
        processed.flag = this._getDriverFlag(entry.driverName);
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

        return this._currentStandings.find(entry => entry.driverName === driverName);
    }

    /**
     * Applies default values for the entry
     * @param driverName - RF2 Driver Name
     */
    _applyEntryDefaults(raw: Entry): ProcessedEntry {
        return {
            ...raw,
            lapsChecked: 0,
            currentLap: this._getEmptyLap()
        };
    }

    /**
     * Gets empty lap object
     */
    _getEmptyLap(): Lap {
        return {
            sector1: null,
            sector1State: null,
            sector2: null,
            sector2State: null,
            sector3: null,
            sector3State: null,
            total: null
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

    /**
     * Take drivername and fetch flag from config
     * @param driverName - RF2 Driver Name
     */
    _getDriverFlag(driverName: string): string {
        driverName = driverName.toLowerCase();

        const driverConfig = this._driversConfig[driverName];
        if (!driverConfig) {
            return null;
        }

        return driverConfig.flag;
    }

    /**
     * Take carclass and fetch colour from config
     * @param carClass - RF2 Car Class
     */
    _getTeamColour(carClass: string): string {
        carClass = carClass.toLowerCase();

        const teamConfig = this._teamsConfig[carClass];
        if (!teamConfig) {
            return '#FFF';
        }

        return teamConfig.colour;
    }
}
