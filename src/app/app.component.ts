import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';


import { WatchService } from './services/watch.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [WatchService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  data: any;
  towerMode: string = 'BASIC'; // FASTEST_LAP_GAP, BASIC, GAP_TO_LEADER

  constructor(
    private watchService: WatchService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this._startDataCycle();
    this._startTowerAlternate();
  }

  _startDataCycle(): void {
    this.watchService.session().subscribe(data => {
      this.data = data;
      this.cdRef.markForCheck();
    });
  }

  _startTowerAlternate(): void {
    setInterval(() => {
      if (this.towerMode === 'BASIC') {
        this.towerMode = 'FASTEST_LAP_GAP';
      } else {
        this.towerMode = 'BASIC';
      }
    }, 10000);
  }

  _getTowerMode(): string {
    return 'FASTEST_LAP_GAP';
  }
  
  _getSectorColour(state: string): string {
    if (state === 'SESSION_BEST') return 'purple';
    if (state === 'PERSONAL_BEST') return 'green';
    if (state === 'DOWN') return 'red';
    return '';
  }

  _getSectorClass(driver: any, sector: number): string {
    let state = null;
    const lastLapHold = driver.lastLapHold;
    if (lastLapHold) {
      state = lastLapHold.lastLap[`sector_${sector}_state`];      
    } else if (sector === 1 || sector === 2) {
      state = driver[`sector${sector}State`];
    }

    if (state === 'SESSION_BEST') return 'sector--sb';
    if (state === 'PERSONAL_BEST') return 'sector--pb';
    if (state === 'DOWN') return 'sector--down';
    return '';
  }
}
