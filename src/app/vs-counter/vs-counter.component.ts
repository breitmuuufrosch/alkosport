import {Component, Input, OnInit} from '@angular/core';
import {SizeProp} from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-vs-counter',
  templateUrl: './vs-counter.component.html',
  styleUrls: ['./vs-counter.component.scss']
})
export class VsCounterComponent implements OnInit {

  @Input() showBig: boolean;
  @Input() countA: number;
  @Input() countS: number;
  @Input() size: SizeProp = '2x';
  @Input() textClass: string;

  constructor() { }

  ngOnInit() {
  }

}
