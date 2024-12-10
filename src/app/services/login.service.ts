import { computed, effect, Injectable, signal, WritableSignal } from '@angular/core';
import { StorageService } from '@services/storage.service';
import { HttpService } from '@services/http.service';
import { StorageKey } from '@constants/storage';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private _isLogin = signal(false);
  isLogin = computed(() => this._isLogin());

  private _token: WritableSignal<string | null> = signal(null);
  token = computed(() => this._token());

  private _customerInfo: WritableSignal<CustomerInfo | null> = signal(null);
  customerInfo = computed(() => this._customerInfo());

  constructor(
    private storage: StorageService,
    private http: HttpService,
  ) {
    this.effectToken();
    this.effectCustomerInfo();

    this.persistLogin();
  }

  setLoginToken(token: string) {
    this._token.set(token);
    this._isLogin.set(true);
  }

  setCustomerInfo(customer: CustomerInfo) {
    this._customerInfo.set(customer);
  }

  setSignOut() {
    this._isLogin.set(false);
    this._customerInfo.set(null);
  }

  private persistLogin() {
    try {
      const localToken = this.storage.getLocal(StorageKey.token);
      if (localToken && typeof localToken === 'string') {
        this.setLoginToken(localToken);
      }

      const localCustomerInfo = this.storage.getLocal(StorageKey.credentials);
      if (localCustomerInfo && typeof localCustomerInfo === 'object') {
        this.setCustomerInfo(localCustomerInfo as CustomerInfo);
      }
    } catch (e) {
      console.error(e);
      this.setSignOut();
    }
  }

  private effectToken() {
    effect(() => {
      const token = this._token();
      if (token) {
        this.storage.setLocal(StorageKey.token, token);
      } else {
        this.storage.removeLocal(StorageKey.token);
      }
    });
  }

  private effectCustomerInfo() {
    effect(() => {
      const customerInfo = this._customerInfo();
      if (customerInfo) {
        this.storage.setLocal(StorageKey.credentials, customerInfo);
      } else {
        this.storage.removeLocal(StorageKey.credentials);
      }
    });
  }
}

export interface CustomerInfo {
  id: string;
  email: string;
  username: string;
  nickname: string;
}
