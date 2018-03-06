import { Component, Input } from '@angular/core';

@Component({
  selector: 'tower',
  templateUrl: './tower.component.html',
  styleUrls: ['./tower.component.scss']
})
export class TowerComponent {
    @Input() standings: any[] = [];
    @Input() mode: string;

    constructor() {}

    ngOnInit(): void {
        console.log(this.mode);
    }
}
