export interface SectorMap {
    key: string;
    colour: string;
    class_name: string;
}

export enum OnboardMode {
    FastestGap = 'FASTEST_GAP',
    PositionGap = 'POSITION_GAP'
}