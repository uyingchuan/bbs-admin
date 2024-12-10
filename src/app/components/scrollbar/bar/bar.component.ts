import { Component, Input } from '@angular/core';
import { GAP } from '../util';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss']
})
export class BarComponent {
  @Input() height!: string;
  @Input() width!: string;
  @Input() always: boolean = false;
  @Input() ratioX!: number;
  @Input() ratioY!: number;

  moveX = 0;
  moveY = 0;

  constructor() {}

  handleScroll(wrap: HTMLDivElement) {
    const offsetHeight = wrap.offsetHeight - GAP;
    const offsetWidth = wrap.offsetWidth - GAP;
    this.moveY = ((wrap.scrollTop * 100) / offsetHeight) * this.ratioY;
    this.moveX = ((wrap.scrollLeft * 100) / offsetWidth) * this.ratioX;
  }
}
