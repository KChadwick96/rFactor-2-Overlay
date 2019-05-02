import { Component, Input, OnDestroy } from '@angular/core';
import TYRES from '../../../assets/tyres';
import { NotificationService } from './../../../services/notification.service';
import { ProcessedEntry } from '../../../interfaces';


@Component({
  selector: 'app-tower',
  templateUrl: './tower.component.html',
  styleUrls: ['./tower.component.scss']
})
export class TowerComponent implements OnDestroy {
    mode: string;
    subscription: any;
    notification: any;
    _session: string;

    public _isRace: boolean;
    private _raceSession: string;
    private _interval;
    private _schedules: any = {
        quali: [{
            mode: 'BASIC' ,
            length: 5
        }, {
            mode: 'FASTEST_LAP_GAP',
            length: 20
        }],
        race: [{
            mode: 'BASIC' ,
            length: 5
        }, {
            mode: 'GAP_TO_LEADER',
            length: 15
        }, {
            mode: 'BASIC',
            length: 5
        }, {
            mode: 'GAP_TO_NEXT',
            length: 40
        }]
    };

    @Input() standings: Array<ProcessedEntry> = [];

    @Input()
    set sessionData(data: any) {
        if (data == null) {
            return;
        }

        const newSession = data.session;

        this._session = data.session;

        this._isRace = newSession.includes('RACE');

        // for race sessions, if its the start or end of the race
        // show the basic tower with names
        let shouldStartCycle = true;
        if (this._isRace) {

            const lapsCompleted = this.standings[0] ? this.standings[0].lapsCompleted : 0;
            if (lapsCompleted === 0 || lapsCompleted >= data.maximumLaps) {
                this._stopCycle();
                shouldStartCycle = false;
                this.mode = 'BASIC';
            }
        }

        this._raceSession = newSession;
        if (shouldStartCycle && this._interval == null) {
            this._startCycle();
        }
    }

    constructor(private notificationService: NotificationService) {
        this.subscription = this.notificationService
          .getNotification()
          .subscribe(notification => {
            // notification used to move tower based on yellow flag component
            if (notification) {
                this.notification = notification.notification;
            }
          });
      }


    _getTyreImage(driver: ProcessedEntry): string {
        if (driver.tyreCompound != null) {
            if (driver.tyreCompound.indexOf('Soft') > -1) {
                return TYRES.SOFT;
            }
            if (driver.tyreCompound.indexOf('Medium') > -1) {
                return TYRES.MEDIUM;
            }
            if (driver.tyreCompound.indexOf('Hard') > -1) {
                return TYRES.HARD;
            }
        }
        return null;
    }

    _startCycle(): void {
        if (!this._raceSession) {
            return;
        }

        this._stopCycle();

        // select schedule based on race session
        let schedule = this._schedules.quali;
        if (this._raceSession.includes('RACE')) {
            // console.log('race schedule');
            schedule = this._schedules.race;
        }

        // go through the schedule and switch when we've reached the part.length
        let currentScheduleIndex = 0;
        let currentDuration = 0;
        this._interval = setInterval(() => {
            const part = schedule[currentScheduleIndex];
            this.mode = part.mode;

            if (currentDuration >= part.length * 1000) {
                currentDuration = 0;

                if (schedule[currentScheduleIndex + 1]) {
                    currentScheduleIndex++;
                } else {
                    currentScheduleIndex = 0;
                }
            } else {
                currentDuration += 1000;
            }
        }, 1000);
    }

    _stopCycle(): void {
        if (this._interval) {
            clearInterval(this._interval);
            this._interval = null;
        }
    }

    _positionClass(entry: ProcessedEntry): string {
        if (entry.position > 10 && (this._raceSession === 'PRACTICE2' || this._raceSession === 'QUALIFY1') && !entry.inGarage) {
            return 'entry__position--elim';
        } else if (this._showDNFStatus(entry)) {
            return 'entry__position--DNF';
        }
    }

    _dnfStatusClass(entry: ProcessedEntry): string {
        return this._showDNFStatus(entry) ? 'entry--DNF' : '';
    }

    /**
     * Stop timing from showing if we're in a race and the entry is pitting
     * @param entry Entry to evalutate
     */
    _shouldShowTiming(entry: ProcessedEntry): boolean {
        return !(this._isRace && entry.pitting && this._showDNFStatus(entry));
    }

    _showPitStatus(entry: ProcessedEntry): string {
        if (this._showDNFStatus(entry)) {
            return 'DNF';
        } else if (entry.pitting) {
            return 'PIT';
        }
        return null;
    }

    _showDNFStatus(entry: ProcessedEntry): boolean {
        return entry.inGarage && this._isRace && this.standings[0] != null && this.standings[0].lapsCompleted > 0;
    }

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.subscription.unsubscribe();
    }
}
