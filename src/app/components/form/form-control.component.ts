import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  Host,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import { FormDirective } from './form.directive';
import { AbstractControl, FormControlDirective, FormControlName, NgControl, NgModel } from '@angular/forms';
import { filter, Observable, startWith, Subject, Subscription, takeUntil } from 'rxjs';
import { FormItemComponent } from './form-item.component';
import { helpMotion } from './help';
import { NgClass } from '@angular/common';
import { StringTemplateOutletDirective } from './string_template_outlet.directive';
import { SafeAny } from '@interfaces/global';

@Component({
  selector: 'app-form-control',
  exportAs: 'appFormControl',
  animations: [helpMotion],
  standalone: true,
  imports: [NgClass, StringTemplateOutletDirective],
  template: `
    <div class="app-form-item-control-input">
      <ng-content></ng-content>
    </div>
    @if (innerTip) {
      <div class="ant-form-item-explain">
        <div role="alert" [ngClass]="['ant-form-item-explain-' + status]">
          <ng-container *nzStringTemplateOutlet="innerTip; context: { $implicit: validateControl }">
            {{ innerTip }}
          </ng-container>
        </div>
      </div>
    }
  `,
})
export class FormControlComponent implements OnChanges, OnDestroy, OnInit, AfterContentInit, OnDestroy {
  @ContentChild(NgControl, { static: false }) defaultValidateControl?: FormControlName | FormControlDirective;

  @Input() successTip?: string | TemplateRef<{ $implicit: AbstractControl | NgModel }>;
  @Input() warningTip?: string | TemplateRef<{ $implicit: AbstractControl | NgModel }>;
  @Input() errorTip?: string | TemplateRef<{ $implicit: AbstractControl | NgModel }>;
  @Input() validatingTip?: string | TemplateRef<{ $implicit: AbstractControl | NgModel }>;
  @Input() autoTips: Record<string, Record<string, string>> = {};
  @Input() disableAutoTips: boolean | 'default' = 'default';

  private validateString: string | null = null;
  private validateChanges: Subscription = Subscription.EMPTY;
  private destroyed$ = new Subject<void>();
  private localeId = 'zh_CN';
  private autoErrorTip?: string;

  status: FormControlStatusType = '';
  validateControl: AbstractControl | NgModel | null = null;
  innerTip: string | TemplateRef<{ $implicit: AbstractControl | NgModel }> | null = null;

  private get autoTipsDisabled(): boolean {
    return this.disableAutoTips !== 'default' ? this.disableAutoTips : this.formDirective?.disableAutoTips;
  }

  constructor(
    private cdr: ChangeDetectorRef,
    @Optional() private formDirective: FormDirective,
    @Optional() @Host() private formItemComponent: FormItemComponent,
  ) {
    this.subscribeAutoTips(this.formDirective?.getInputObservable('autoTips'));
    this.subscribeAutoTips(
      this.formDirective?.getInputObservable('disableAutoTips').pipe(filter(() => this.disableAutoTips === 'default')),
    );
  }

  private subscribeAutoTips(observable: Observable<SafeAny>): void {
    observable?.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      if (!this.autoTipsDisabled) {
        this.updateAutoErrorTip();
        this.setStatus();
        this.cdr.markForCheck();
      }
    });
  }

  ngAfterContentInit(): void {
    if (!this.validateControl && !this.validateString) {
      if (this.defaultValidateControl instanceof FormControlDirective) {
        this.validateStatus = this.defaultValidateControl.control;
      } else {
        this.validateStatus = this.defaultValidateControl!;
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { disableAutoTips, autoTips, successTip, warningTip, errorTip, validatingTip } = changes;

    if (disableAutoTips || autoTips) {
      this.updateAutoErrorTip();
      this.setStatus();
    } else if (successTip || warningTip || errorTip || validatingTip) {
      this.setStatus();
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngOnInit(): void {
    this.setStatus();
  }

  @Input()
  set validateStatus(value: string | AbstractControl | FormControlName | NgModel) {
    if (value instanceof AbstractControl || value instanceof NgModel) {
      this.validateControl = value;
      this.validateString = null;
      this.watchControl();
    } else if (value instanceof FormControlName) {
      this.validateControl = value.control;
      this.validateString = null;
      this.watchControl();
    } else {
      this.validateControl = null;
      this.validateString = value;
      this.watchControl();
    }
  }

  private watchControl() {
    this.validateChanges.unsubscribe();
    if (this.validateControl && this.validateControl.statusChanges) {
      this.validateChanges = (this.validateControl.statusChanges as Observable<SafeAny>)
        .pipe(startWith(null), takeUntil(this.destroyed$))
        .subscribe(() => {
          if (!this.autoTipsDisabled) {
            this.updateAutoErrorTip();
          }
          this.setStatus();
          this.cdr.markForCheck();
        });
    }
  }

  private updateAutoErrorTip() {
    if (!this.validateControl) return;

    const errors = this.validateControl.errors || {};
    let autoErrorTip = '';
    for (const key in errors) {
      if (Object.prototype.hasOwnProperty.call(errors, key)) {
        // 寻找对应的tip
        autoErrorTip =
          errors[key]?.[this.localeId] ??
          this.autoTips?.[this.localeId]?.[key] ??
          this.autoTips?.['default']?.[key] ??
          this.formDirective.autoTips?.[this.localeId]?.[key] ??
          this.formDirective.autoTips?.['default']?.[key];
        // tip如果存在变量的形式，则将error中的详细信息抛出去
        if (errors?.[key] instanceof Object) {
          autoErrorTip = this.replaceVariables(autoErrorTip, errors?.[key]);
        }
      }
      if (autoErrorTip) break;
    }
    this.autoErrorTip = autoErrorTip;
  }

  // 替换变量名
  replaceVariables(template: string, variables: Record<string, string>): string {
    return template.replace(/\{\{(\w+)}}/g, (match, variableName) => {
      return variableName in variables ? variables[variableName] : match;
    });
  }

  private setStatus() {
    this.status = this.getControlStatus(this.validateString);
    this.innerTip = this.getInnerTip(this.status);
    if (this.formItemComponent) {
      this.formItemComponent.setWithHelpViaTips(!!this.innerTip);
      this.formItemComponent.setStatus(this.status);
    }
  }

  private getInnerTip(status: FormControlStatusType):
    | string
    | TemplateRef<{
        $implicit: AbstractControl | NgModel;
      }>
    | null {
    switch (status) {
      case 'error':
        return (!this.autoTipsDisabled && this.autoErrorTip) || this.errorTip || null;
      case 'validating':
        return this.validatingTip || null;
      case 'success':
        return this.successTip || null;
      case 'warning':
        return this.warningTip || null;
      default:
        return null;
    }
  }

  private getControlStatus(validateString: string | null): FormControlStatusType {
    let status: FormControlStatusType;

    if (validateString === 'warning' || this.validateControlStatus('INVALID', 'warning')) {
      status = 'warning';
    } else if (validateString === 'error' || this.validateControlStatus('INVALID')) {
      status = 'error';
    } else if (
      validateString === 'validating' ||
      validateString === 'pending' ||
      this.validateControlStatus('PENDING')
    ) {
      status = 'validating';
    } else if (validateString === 'success' || this.validateControlStatus('VALID')) {
      status = 'success';
    } else {
      status = '';
    }

    return status;
  }

  private validateControlStatus(validStatus: string, statusType?: FormControlStatusType): boolean {
    if (!this.validateControl) return false;

    const { dirty, touched, status } = this.validateControl;
    return (!!dirty || !!touched) && (statusType ? this.validateControl.hasError(statusType) : status === validStatus);
  }
}

export type FormControlStatusType = 'success' | 'error' | 'warning' | 'validating' | '';
