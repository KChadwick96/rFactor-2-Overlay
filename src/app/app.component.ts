import { Component } from '@angular/core';
import { WatchService } from './services/watch.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [WatchService]
})
export class AppComponent {

  session: any;
  standings: any = [];
  focusedEntry: any;

  constructor(
    private watchService: WatchService
  ) {}

  ngOnInit(): void {
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

        // calculate gap + set focused driver
        let focusedEntry;
        this.standings.forEach(entry => {
          entry.gapToLeader = (entry.bestLapTime - this.standings[0].bestLapTime).toFixed(3);
          if (entry.focus) focusedEntry = entry;  
        });
        this.focusedEntry = focusedEntry;
      },
      error => console.log(error)
    );
  }
}
