import { Injectable } from '@angular/core';
import { StorageService } from '@services/storage.service';
import { HttpService } from '@services/http.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  get isLogin(): boolean {
    return this._isLogin;
  }

  private _isLogin = false;

  constructor(
    private storage: StorageService,
    private http: HttpService,
  ) {}

  // 刷新登录状态
  setSignIn() {
    this._isLogin = true;
  }

  // 移除登陆状态
  setSignOut() {
    this._isLogin = false;
  }
}
