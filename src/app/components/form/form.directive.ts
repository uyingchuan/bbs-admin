import { Directive, Input, OnChanges, OnDestroy, SimpleChange, SimpleChanges } from '@angular/core';
import { InputObservable } from './input-observable';
import { filter, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Directive({
  selector: '[appForm]',
  standalone: true,
})
export class FormDirective implements OnChanges, OnDestroy, InputObservable {
  @Input() autoTips: Record<string, Record<string, string>> = {
    zh_CN: {
      required: '此项必填',
      email: '邮箱格式不正确',
      min: '最小值：{{min}}',
      max: '最大值：{{max}}',
      minlength: '最小长度：{{requiredLength}}',
      maxlength: '最大长度：{{requiredLength}}',
      format: '格式不正确',
    },
  };
  @Input() disableAutoTips = false;

  private inputChanges$ = new Subject<SimpleChanges>();

  getInputObservable<K extends keyof this>(changeType: K): Observable<SimpleChange> {
    return this.inputChanges$.pipe(
      filter((changes) => changeType in changes),
      map((value) => value[changeType as string]),
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.inputChanges$.next(changes);
  }

  ngOnDestroy(): void {
    this.inputChanges$.complete();
  }
}
