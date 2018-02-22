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
        this.standings = standings.sort((a, b) => {
          return a.position - b.position;
        });

        // limit 20
        this.standings.splice(20);

        // calculate gap + colour + set focused driver
        let focusedEntry;
        this.standings.forEach(entry => {
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
