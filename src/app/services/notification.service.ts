import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class NotificationService {
  private subject = new Subject<any>();

  sendNotification(notification: string) {
    this.subject.next({ notification });
}

  getNotification(): Observable<any> {
    return this.subject.asObservable();
}

}
