import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly documentIsAccessible!: boolean;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {
    this.documentIsAccessible = isPlatformBrowser(this.platformId);
  }

  /**
   * @param key
   * @param value
   * @param expireSec 为`null | undefined`时长期有效，单位s
   * @param domain 为`null | undefined`时完整域名
   */
  public setCookie(key: string, value: string | null, expireSec?: null | number, domain?: string): void {
    if (!this.documentIsAccessible) {
      return;
    }

    let expire: Date;
    const now = new Date().getTime();
    if (expireSec) {
      expire = new Date(now + expireSec * 1000);
    } else {
      expire = new Date(now + 999999999999);
    }
    let data = value;
    if (typeof value === 'object') {
      data = JSON.stringify(value);
    }
    this.document.cookie =
      `${key}=${data};` +
      'path=/;' +
      'SameSite=None;' +
      'Secure;' +
      `domain=${domain ?? ''};` +
      `expires=${expire.toUTCString()}`;
  }

  public getCookie(key: string): string | null {
    if (!this.documentIsAccessible) {
      return null;
    }

    const name = key + '=';
    const decodedCookie = decodeURIComponent(this.document.cookie);
    const ca = decodedCookie.split(';');
    for (let c of ca) {
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
  }

  removeCookie(name: string, domain?: string): void {
    if (!this.documentIsAccessible) {
      return;
    }

    this.setCookie(name, '', -1, domain);
  }

  public setLocal(key: string, value: unknown) {
    if (!this.documentIsAccessible) {
      return;
    }

    localStorage.setItem(key, JSON.stringify(value));
  }

  public getLocal<T>(key: string): T | null {
    if (!this.documentIsAccessible) {
      return null;
    }

    const data = localStorage.getItem(key);
    if (!data) {
      return null;
    }
    return JSON.parse(data);
  }

  public removeLocal(key: string) {
    if (!this.documentIsAccessible) {
      return;
    }

    localStorage.removeItem(key);
  }

  public clearLocal() {
    if (!this.documentIsAccessible) {
      return;
    }

    localStorage.clear();
  }

  getSession<T>(key: string): T | null {
    if (!this.documentIsAccessible) {
      return null;
    }

    const data = sessionStorage.getItem(key);
    if (!data) {
      return null;
    }
    return JSON.parse(data);
  }

  setSession(key: string, value: unknown): void {
    if (!this.documentIsAccessible) {
      return;
    }

    sessionStorage.setItem(key, JSON.stringify(value));
  }

  clearSession() {
    if (!this.documentIsAccessible) {
      return;
    }

    sessionStorage.clear();
  }

  removeSession(key: string) {
    if (!this.documentIsAccessible) {
      return;
    }

    sessionStorage.removeItem(key);
  }
}
