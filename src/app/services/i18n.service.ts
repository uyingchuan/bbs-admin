import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { TranslateService } from '@ngx-translate/core';
import { HttpService } from '@services/http.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageKey } from '@constants/storage';
import { MessageService } from '@services/message.service';

@Injectable({
  providedIn: 'root',
})
export class I18nService {
  languages: Language[] = [
    {
      key: 'en',
      name: 'English',
    },
    {
      key: 'zh_CN',
      name: '中文简体',
    },
  ];

  private _defaultLang = this.languages[1];
  private _i18nSubject = new BehaviorSubject<Language>(this._defaultLang);

  currentLang = this._defaultLang;

  get localeChange(): Observable<Language> {
    return this._i18nSubject.asObservable();
  }

  constructor(
    private storageService: StorageService,
    private translateService: TranslateService,
    private messageService: MessageService,
  ) {}

  /**
   * 翻译文本
   * @param prefix 路径前缀
   * @param key 索引
   */
  translate(prefix: string, key?: string | null): string | object {
    if (!key) {
      return this.translateService.instant(prefix);
    }
    return this.translateService.instant(`${prefix}.${key}`);
  }

  getTranslate(prefix: string, key?: string | null): Observable<string | object> {
    if (!key) {
      return this.translateService.get(prefix);
    }
    return this.translateService.get(`${prefix}.${key}`);
  }

  /**
   * 翻译接口错误
   * @param uri 接口错误翻译的object键名
   * @param code 接口返回code
   */
  showErrorMessage(uri: string, code: string) {
    if (code === HttpService.unknownErrorCode) {
      this.messageService.error('系统异常');
      return;
    } else if (code === HttpService.knownErrorCode) {
      return;
    }
    const path = `${uri}.${code}`;
    const text = this.translate(`${uri}.${code}`);
    if (!text) {
      this.messageService.error(path);
    } else {
      this.messageService.error(text.toString());
    }
  }

  setLang(lang: string) {
    const language = this.languages.find((e) => e.key === lang) ?? this._defaultLang;
    this.currentLang = language;
    this.storageService.setLocal(StorageKey.lang, language.key);
    this.translateService.use(language.key);
    this._i18nSubject.next(language);
  }
}

export interface Language {
  key: string;
  name: string;
}
