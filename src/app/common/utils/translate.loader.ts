import { TranslateLoader } from '@ngx-translate/core';
import { forkJoin, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { formatDate, PlatformLocation } from '@angular/common';
import { catchError, map } from 'rxjs/operators';

export function translateLoaderFactory(http: HttpClient, location: PlatformLocation) {
  const hostname = location.hostname;
  const suffix = `t=${formatDate(new Date(), 'yyyy-MM-dd', 'zh')}&s=${hostname}`;

  const translationResource: TranslationResource[] = [{ url: `/assets/i18n/{{lang}}.json?${suffix}` }];
  return new TranslateBrowserLoader(http, translationResource);
}

export class TranslateBrowserLoader implements TranslateLoader {
  constructor(
    private httpClient: HttpClient,
    private resources: TranslationResource[],
  ) {}

  public getTranslation(lang: string): Observable<object> {
    const requests: Observable<object>[] = this.resources.map((resource: TranslationResource) => {
      const path = resource.url.replace('{{lang}}', lang);
      return this.httpClient.get(path).pipe(
        map((response) => (resource.callbackFn ? resource.callbackFn(response) : response)),
        catchError(() => {
          return of({});
        }),
      );
    });

    return forkJoin(requests).pipe(
      map((responses) => {
        let data: object = {};
        responses.forEach((response) => (data = { ...data, ...response }));
        return data;
      }),
      catchError(() => {
        return of({});
      }),
    );
  }
}

export interface TranslationResource {
  url: string;
  callbackFn?: (response: object) => object;
}
