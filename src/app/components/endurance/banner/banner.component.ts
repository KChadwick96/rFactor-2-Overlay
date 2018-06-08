import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-banner-endurance',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerEnduranceComponent {
  @Input() sessionData: any;
}
