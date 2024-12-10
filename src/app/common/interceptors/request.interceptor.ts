import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, ObservableInput } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MessageService } from '@services/message.service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private message: MessageService,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      // 捕获异常
      catchError((err): ObservableInput<HttpEvent<unknown>> => {
        if (err.status === 401) {
          this.message.error('登录失效，请重新登录');
          this.router.navigate(['/login'], { queryParams: { callback: window.location.href } }).then();
        } else if (err.status === 403) {
          this.message.error('禁止访问，如有需要请联系管理员');
        }
        throw err;
      }),
    );
  }
}
