import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, Http } from '@angular/http';

import { AppComponent } from './app.component';
import { BannerComponent } from './components/default/banner/banner.component';
import { OnboardComponent } from './components/default/onboard/onboard.component';
import { TowerComponent } from './components/default/tower/tower.component';
import { BannerEnduranceComponent } from './components/endurance/banner/banner.component';
import { TowerEnduranceComponent } from './components/endurance/tower/tower.component';

import { ConfigService } from './services/config.service';
import { DriverNamePipe } from './pipes/driver-name.pipe';
import { MinutesAndSecondsPipe } from './pipes/minutes-and-seconds.pipe';
import { SecondsConvertPipe } from './pipes/seconds-convert.pipe';
import { SessionNamePipe } from './pipes/session-name.pipe';
import { SessionTimerPipe } from './pipes/session-timer.pipe';

const COMPONENTS = [
  AppComponent,
  BannerComponent,
  OnboardComponent,
  TowerComponent,
  BannerEnduranceComponent,
  TowerEnduranceComponent
];

@NgModule({
  declarations: [
    ...COMPONENTS,
    DriverNamePipe,
    MinutesAndSecondsPipe,
    SecondsConvertPipe,
    SessionNamePipe,
    SessionTimerPipe
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: (config: ConfigService) => () => config.load(),
      deps: [ConfigService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
