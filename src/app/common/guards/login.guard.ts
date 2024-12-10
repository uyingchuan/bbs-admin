import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '@services/login.service';
import { StorageService } from '@services/storage.service';
import { MessageService } from '@services/message.service';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard {
  constructor(
    private router: Router,
    private storage: StorageService,
    private loginService: LoginService,
    private messageService: MessageService,
  ) {}

  canActivateChild(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.isLogin();
  }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isLogin();
  }

  isLogin(): Promise<boolean> | boolean {
    const isLogin = this.loginService.isLogin;
    if (!isLogin) {
      this.router.navigate(['/auth/login']).then();
    }
    return isLogin;
  }
}
