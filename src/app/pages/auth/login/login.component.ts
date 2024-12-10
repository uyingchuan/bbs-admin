import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormItemComponent } from '@components/form/form-item.component';
import { FormControlComponent } from '@components/form/form-control.component';
import { NzFormLabelComponent } from '@components/form/form-label.component';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import { isInvalidForm } from '@components/form/form.util';
import { HttpService } from '@services/http.service';
import { environment } from '@environment';
import { CustomerInfo, LoginService } from '@services/login.service';
import { I18nService } from '@services/i18n.service';
import { FormDirective } from '@components/form/form.directive';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormDirective,
    ReactiveFormsModule,
    FormItemComponent,
    FormControlComponent,
    NzFormLabelComponent,
    InputText,
    Button,
    RouterLink,
    FormDirective,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private i18n: I18nService,
    private router: Router,
    private loginService: LoginService,
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.loginForm = this.fb.group({
      account: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.maxLength(24)]],
    });
  }

  submitForm() {
    if (isInvalidForm(this.loginForm)) return;

    this.http.doPost<LoginResponse>(
      environment.server.bbsServer + environment.urls.auth.login,
      this.loginForm.value,
      (res) => {
        this.loginService.setLoginToken(res.token);
        this.loginService.setCustomerInfo(res.userInfo);
        this.router.navigate(['/dashboard']).then();
      },
      (code) => {
        this.i18n.showErrorMessage(environment.urls.auth.login, code);
      },
    );
  }
}

interface LoginResponse {
  token: string;
  userInfo: CustomerInfo;
}
