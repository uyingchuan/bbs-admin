import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { I18nService } from '@services/i18n.service';
import { firstValueFrom } from 'rxjs';
import { IndexableObject } from '@interfaces/global.d';
import { MessageService } from '@services/message.service';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  // 业务成功
  private successCode = '000000';
  // 请求失败，未知异常，对用户可见
  static unknownErrorCode = '111111';
  // 请求失败，但不需要处理（401），对用户不可见
  static knownErrorCode = '222222';

  private defaultOptions!: IndexableObject;

  constructor(
    private http: HttpClient,
    private i18n: I18nService,
    private message: MessageService,
  ) {
    this.i18n.localeChange.subscribe(() => {
      this.defaultOptions = {
        withCredentials: true,
        headers: { 'Accept-Language': this.i18n.currentLang.key },
      };
    });
  }

  doGet<T>(
    url: string,
    data: Record<string, string | number | boolean | null | undefined>,
    success?: SuccessCallback<T>,
    failed?: FailedCallback,
  ) {
    let param = new HttpParams();
    for (const c in data) {
      if (Object.hasOwnProperty.call(data, c) && data[c] !== undefined && data[c] !== null) {
        param = param.set(c, data[c]!);
      }
    }
    return this.http.get<BaseHttpResponse<T>>(`${url}?${param}`, this.defaultOptions).subscribe({
      next: (res: BaseHttpResponse<T>) => this.onSuccess<T>(res, success, failed),
      error: (err: HttpErrorResponse) => this.onError(err, failed),
    });
  }

  doGetPromise<T>(
    url: string,
    data: Record<string, string | number | boolean | null | undefined> = {},
  ): Promise<BaseHttpResponse<T>> {
    let param = new HttpParams();
    for (const c in data) {
      if (Object.hasOwnProperty.call(data, c) && data[c] !== undefined && data[c] !== null) {
        param = param.set(c, data[c]!);
      }
    }
    return firstValueFrom(this.http.get<BaseHttpResponse<T>>(`${url}?${param}`, this.defaultOptions)).then(
      (res) => {
        return this.onPromiseSuccess(res);
      },
      (err) => {
        return this.onPromiseError(err);
      },
    );
  }

  doPost<T>(url: string, params: object, success?: SuccessCallback<T>, failed?: FailedCallback) {
    return this.http.post<BaseHttpResponse<T>>(url, params, this.defaultOptions).subscribe({
      next: (res: BaseHttpResponse<T>) => this.onSuccess<T>(res, success, failed),
      error: (err: HttpErrorResponse) => this.onError(err, failed),
    });
  }

  doPostPromise<T>(url: string, params: object): Promise<BaseHttpResponse<T>> {
    return firstValueFrom(this.http.post<BaseHttpResponse<T>>(url, params, this.defaultOptions)).then(
      (res) => {
        return this.onPromiseSuccess(res);
      },
      (err) => {
        return this.onPromiseError(err);
      },
    );
  }

  private onPromiseSuccess<T>(res: BaseHttpResponse<T>): BaseHttpResponse<T> {
    if (res.code === this.successCode) {
      return res;
    } else {
      return res;
    }
  }

  private onPromiseError<T>(err: HttpErrorResponse): BaseHttpResponse<T> {
    if (err.status === 401 || err.status === 403) {
      return { code: HttpService.knownErrorCode, data: null, success: false, messages: '' };
    }
    return { code: HttpService.unknownErrorCode, data: null, success: false, messages: '' };
  }

  private onSuccess<T>(res: BaseHttpResponse<T>, sc?: SuccessCallback<T>, fc?: FailedCallback) {
    if (res.code === this.successCode && !!sc) {
      sc(res.data!);
    } else if (fc) {
      fc(res.code, res.messages, res.data);
    }
  }

  private onError(err: HttpErrorResponse, fc?: FailedCallback) {
    if ((err.status === 401 || err.status === 403) && !!fc) {
      fc(HttpService.knownErrorCode, err.message);
    } else if (fc) {
      this.message.error(err.error.message);
      fc(HttpService.knownErrorCode, err.message);
    }
  }
}

export interface BaseHttpResponse<T> {
  code: string;
  data: T | null;
  messages: unknown[] | string;
  success: boolean;
}

export type SuccessCallback<T> = (res: T) => void;

export type FailedCallback = (code: string, msg: unknown[] | string, data?: unknown) => void;
