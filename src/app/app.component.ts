import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';
import { TranslateService } from '@ngx-translate/core';
import { I18nService } from '@services/i18n.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Toast],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(
    private translate: TranslateService,
    private i18n: I18nService,
  ) {
    this.translate.setDefaultLang(this.i18n.currentLang.key);
  }
}
