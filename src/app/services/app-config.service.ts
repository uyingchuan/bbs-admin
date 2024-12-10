import { computed, effect, Injectable, signal, WritableSignal } from '@angular/core';
import { StorageService } from './storage.service';
import { StorageKey } from '@constants/storage';

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  private _appConfig!: WritableSignal<AppConfig>;
  appConfig = computed(() => this._appConfig());

  constructor(private storageService: StorageService) {
    this.persistConfig();

    this.effectConfig();
  }

  private persistConfig() {
    const localeConfig = this.storageService.getLocal<AppConfig>(StorageKey.config);
    this._appConfig = signal({
      darkMode: localeConfig?.darkMode ?? false,
      scale: localeConfig?.scale ?? 14,
      showTag: localeConfig?.showTag ?? true,
    });
  }

  private effectConfig() {
    effect(() => {
      const config = this.appConfig();
      this.changeScale(config.scale);
      this.storageService.setLocal(StorageKey.config, this._appConfig());
    });
  }

  private changeScale(value: number) {
    document.documentElement.style.fontSize = `${value}px`;
  }
}

export interface AppConfig {
  darkMode: boolean;
  scale: number;
  showTag: boolean;
}
