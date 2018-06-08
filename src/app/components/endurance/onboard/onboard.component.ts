import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-onboard-endurance',
  templateUrl: './onboard.component.html',
  styleUrls: ['./onboard.component.scss']
})
export class OnboardEnduranceComponent implements OnInit {

    @Input() driver: any;

    constructor() {}

    ngOnInit() {
        setInterval(() => console.log(this.driver), 5000);
    }
}
