
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule, JsonpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { BannerComponent } from './components/default/banner/banner.component';
import { OnboardComponent } from './components/default/onboard/onboard.component';
import { TowerComponent } from './components/default/tower/tower.component';
import { FastestLapComponent } from './components/default/fastestlap/fastestlap.component';
import { FastestSectorComponent } from './components/default/fastestsector/fastestsector.component';
import { SectorFlagsComponent } from './components/default/sectorFlags/sectorFlags.component';
import { BannerEnduranceComponent } from './components/endurance/banner/banner.component';
import { OnboardEnduranceComponent } from './components/endurance/onboard/onboard.component';
import { TowerEnduranceComponent } from './components/endurance/tower/tower.component';
import { WinnerComponent } from './components/default/winner/winner.component';

import { ConfigService, StandingsService, LiveService, NotificationService } from './services';
import { DriverNamePipe } from './pipes/driver-name.pipe';
import { MinutesAndSecondsPipe } from './pipes/minutes-and-seconds.pipe';
import { SecondsConvertPipe } from './pipes/seconds-convert.pipe';
import { SessionNamePipe } from './pipes/session-name.pipe';
import { SessionTimerPipe } from './pipes/session-timer.pipe';
import { DurationFormatPipe } from './pipes/duration-format.pipe';


const COMPONENTS = [
  AppComponent,
  BannerComponent,
  OnboardComponent,
  TowerComponent,
  FastestLapComponent,
  FastestSectorComponent,
  SectorFlagsComponent,
  BannerEnduranceComponent,
  OnboardEnduranceComponent,
  TowerEnduranceComponent,
  WinnerComponent
];

@NgModule({
  declarations: [
    ...COMPONENTS,
    DriverNamePipe,
    MinutesAndSecondsPipe,
    SecondsConvertPipe,
    SessionNamePipe,
    SessionTimerPipe,
    DurationFormatPipe
  ],
  imports: [BrowserModule, BrowserAnimationsModule, HttpModule, JsonpModule],
  providers: [
    ConfigService,
    StandingsService,
    LiveService,
    NotificationService,
    {
      provide: APP_INITIALIZER,
      useFactory: (config: ConfigService) => () => config.load(),
      deps: [ConfigService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
