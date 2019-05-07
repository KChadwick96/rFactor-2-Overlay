import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class NotificationService {
  private subject = new Subject<any>();
  private fastestSectorSubject = new Subject<any>();

  sendNotification(notification: string) {
      this.subject.next({ notification });
  }

  getNotification(): Observable<any> {
      return this.subject.asObservable();
  }

  sendNewFastestSector(sectorKey: string, sectorTime: number, driverName: string) {
    this.fastestSectorSubject.next({sector: sectorKey, time: sectorTime, driver: driverName});
  }

  getNewFastestSector(): Observable<any> {
    return this.fastestSectorSubject.asObservable();
  }

}
