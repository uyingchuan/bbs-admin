import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { FormControlStatusType } from './form-control.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-form-item',
  exportAs: 'appFormItem',
  template: ` <ng-content></ng-content>`,
  host: {
    class: 'app-form-item',
    '[class.app-form-item-has-success]': 'status === "success"',
    '[class.app-form-item-has-warning]': 'status === "warning"',
    '[class.app-form-item-has-error]': 'status === "error"',
    '[class.app-form-item-is-validating]': 'status === "validating"',
    '[class.app-form-item-with-help]': 'withHelpClass',
  },
  standalone: true,
})
export class FormItemComponent implements OnDestroy {
  status: FormControlStatusType = '';
  withHelpClass = false;

  private destroy$ = new Subject<boolean>();

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  setStatus(status: FormControlStatusType): void {
    this.status = status;
    this.cdr.markForCheck();
  }

  setWithHelpViaTips(value: boolean): void {
    this.withHelpClass = value;
    this.cdr.markForCheck();
  }
}
