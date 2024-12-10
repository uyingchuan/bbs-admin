import { Component, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-form-label',
  exportAs: 'appFormLabel',
  template: `
    <label [attr.for]="appFor" [class.app-form-item-required]="required" class="app-form-label">
      <span class="app-form-label-text"><ng-content></ng-content></span>
    </label>
  `,
  host: {
    class: 'app-form-item-label',
  },
  imports: [NgIf],
  standalone: true,
})
export class NzFormLabelComponent implements OnDestroy {
  @Input() appFor?: string;
  @Input() required = false;

  private destroy$ = new Subject<boolean>();

  constructor() {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
