import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CoreCommonModule } from '@core/common.module';
import { AuthLoginV2Component } from 'app/main/pages/authentication/auth-login-v2/auth-login-v2.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthComponent } from './auth/auth.component';
import { SharedModule } from 'app/components/shared.module';
import { AcessoClienteComponent } from './acesso-cliente/acesso-cliente.component';
import { NgxMaskModule, IConfig } from 'ngx-mask';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

// routing
const routes: Routes = [
  {
    path: 'authentication',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'authentication',
    component: AuthComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'cliente',
        component: AcessoClienteComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    AuthLoginV2Component,
    RegisterComponent,
    LoginComponent,
    AuthComponent,
    AcessoClienteComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    CoreCommonModule,
    SharedModule,
    NgxMaskModule.forRoot(options)
  ]
})
export class AuthenticationModule {}
