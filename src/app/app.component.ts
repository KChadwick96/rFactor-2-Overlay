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

  constructor(
    private watchService: WatchService
  ) {}

  ngOnInit(): void {
    this.getSession();
    setInterval(() => this.getStandings(), 2000);
  }

  getSession(): void {
    this.watchService.getSession().subscribe(
      session => {
        console.log(session);
        this.session = session;
      },
      error => console.log(error)
    );
  }

  getStandings(): void {
    this.watchService.getStandings().subscribe(
      standings => {
        this.standings = standings.sort((a, b) => {
          return a.position - b.position;
        });
        console.log(this.standings);
      },
      error => console.log(error)
    );
  }
}
