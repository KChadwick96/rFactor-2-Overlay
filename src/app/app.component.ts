import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { environment } from '../environments/environment';
import { ConfigService, WatchService, LiveService } from './services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [WatchService, LiveService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  data: any;
  theme = 'default';
  production = true;

  constructor(
    private configService: ConfigService,
    private watchService: WatchService,
    private liveService: LiveService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this._startDataCycle();
    this.theme = this.configService.get('theme');
    this.production = environment.production;
  }

  _startDataCycle(): void {
    this.watchService.session().subscribe(data => {
      this.data = data;
      this.cdRef.markForCheck();
    });

    this.liveService.start();
  }
}
