import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tower-endurance',
  templateUrl: './tower.component.html',
  styleUrls: ['./tower.component.scss']
})
export class TowerEnduranceComponent {
    @Input() standings: any[] = [];

    constructor() {}
}
