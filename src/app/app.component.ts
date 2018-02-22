import { Component } from '@angular/core';

import { ConfigService } from './services/config.service';
import { WatchService } from './services/watch.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ConfigService, WatchService]
})
export class AppComponent {

  teamsConfig: any;
  session: any;
  standings: any = [];
  focusedEntry: any;
  driverLaps: any = {};
  overallBestLap: any = {};

  constructor(
    private configService: ConfigService,
    private watchService: WatchService
  ) {}

  ngOnInit(): void {
    this.teamsConfig = this.configService.getTeamsConfig();

    setInterval(() => this.getSession(), 500);
    setInterval(() => this.getStandings(), 500);
  }

  getSession(): void {
    this.watchService.getSession().subscribe(
      session => this.session = session,
      error => console.log(error)
    );
  }

  getStandings(): void {
    this.watchService.getStandings().subscribe(
      standings => {

        // sort by position
        this.standings = standings.sort((a, b) => {
          return a.position - b.position;
        });

        // calculate gap + colour + set focused driver
        let focusedEntry;
        this.standings.forEach(entry => {

          // does the driver exist in the driverlaps object
          if (this.driverLaps[entry.driverName] === undefined) {
            this.driverLaps[entry.driverName] = {
              best_lap: null,
              laps: []
            }
          }

          // do we need to save the drivers lap
          if (this.driverLaps[entry.driverName].laps.length < entry.lapsCompleted) {
            const lap = {
              sector_1: entry.lastSectorTime1,
              sector_2: entry.lastSectorTime2,
              sector_3: entry.lastLapTime - (entry.lastSectorTime1 - entry.lastSectorTime2),
              total: entry.lastLapTime
            }

            this.driverLaps[entry.driverName].laps.push(lap);

            // is this their fastest?
            if (this.driverLaps[entry.driverName].best_lap === null || this.driverLaps[entry.driverName].total > lap.total) {
              this.driverLaps[entry.driverName].best_lap = lap;
            }

            // is this the overall fastest?
            if (this.overallBestLap.total === undefined || this.overallBestLap.total > lap.total) {
              this.overallBestLap = lap;
            }
          }

          console.log(this.driverLaps);
          console.log(this.overallBestLap);

          // calculate gap to leader
          entry.gapToLeader = (entry.bestLapTime - this.standings[0].bestLapTime).toFixed(3);

          // colour
          entry.colour = '#FFF';
          const carClass = entry.carClass.toLowerCase();
          if (this.teamsConfig[carClass]) {
            entry.colour = this.teamsConfig[carClass].colour;
          }

          // set focusedentry
          if (entry.focus) focusedEntry = entry;  
        });
        this.focusedEntry = focusedEntry;
      },
      error => console.log(error)
    );
  }
}
