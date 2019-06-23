export interface Entry {
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
    readonly inControl: string;
}

export interface ProcessedEntry extends Entry {
    lapsChecked: number;
    gapToLeader?: string;
    bestLap?: Lap;
    bestSector1?: number;
    bestSector2?: number;
    bestSector3?: number;
    currentLap?: Lap;
    lastLap?: Lap;
    gapEvent?: GapEvent;
    lastLapHold?: LapHold;
    colour?: string;
    flag?: string;
    tyreCompound?: string;
    inGarage?: boolean;
}

export interface Lap {
    sector1: number;
    sector1State: State;
    sector2: number;
    sector2State: State;
    sector3: number;
    sector3State: State;
    total: number;
    driver: Entry;
}

export interface SectorFlags {
    sector1: SectorFlag;
    sector2: SectorFlag;
    sector3: SectorFlag;
}

export interface Sectors {
    sector1: number;
    sector2: number;
    sector3: number;
}

export interface GapEvent {
    state: State;
    gap: string;
}

export interface LapHold {
    lap: Lap;
    counter: number;
    gap: string;
    state: State;
}

export enum State {
    SessionBest = 'SESSION_BEST',
    PersonalBest = 'PERSONAL_BEST',
    Down = 'DOWN'
}

export enum SectorFlag {
   Green = 13,
   Yellow = 1
}
