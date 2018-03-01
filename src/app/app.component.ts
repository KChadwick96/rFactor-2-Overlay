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

  constructor(
    private watchService: WatchService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this._startDataCycle();
  }

  _startDataCycle(): void {
    this.watchService.session().subscribe(data => {
      this.data = data;
      this.cdRef.markForCheck();
    });
  }
  
  _getSectorColour(state: string): string {
    if (state === 'SESSION_BEST') return 'purple';
    if (state === 'PERSONAL_BEST') return 'green';
    if (state === 'DOWN') return 'red';
  }
}
