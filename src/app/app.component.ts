import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { environment } from '../environments/environment';
import { ConfigService } from './services/config.service';
import { WatchService } from './services/watch.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [WatchService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  data: any;
  theme: string = 'default';
  production: boolean = true;

  constructor(
    private configService: ConfigService,
    private watchService: WatchService,
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
  }
}
