import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import 'hammerjs';
import { NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr'; // For auth after login toast

import { CoreModule } from '@core/core.module';
import { CoreCommonModule } from '@core/common.module';
import { CoreSidebarModule, CoreThemeCustomizerModule } from '@core/components';

import { coreConfig } from 'app/app-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { AuthGuard } from './guards/auth.guard';

import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';

import { NgbDateCustomParserFormatter } from './Utils/date-formatter.service';

registerLocaleData(localePt);

const appRoutes: Routes = [
  {
    path: 'pages',
    loadChildren: () => import('./main/pages/pages.module').then(m => m.PagesModule)
  },
  {
    path: 'portal/:documento',
    loadChildren: () => import('./main/portal/portal.module').then(m => m.PortalModule)
  },

  {
    path: '',
    loadChildren: () => import('./main/home/home.module').then(m => m.HomeModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'estabelecimento',
    loadChildren: () => import('./entities-modules/estabelecimento/estabelecimento.module').then(m => m.EstabelecimentoModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'cliente',
    loadChildren: () => import('./entities-modules/pessoa/pessoa.module').then(m => m.PessoaModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'cobranca',
    loadChildren: () => import('./entities-modules/cobranca/cobranca.module').then(m => m.CobrancaModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'produto',
    loadChildren: () => import('./entities-modules/produto/produto.module').then(m => m.ProdutoModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'plano',
    loadChildren: () => import('./entities-modules/plano/plano.module').then(m => m.PlanoModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'assinatura',
    loadChildren: () => import('./entities-modules/assinatura/assinatura.module').then(m => m.AssinaturaModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'templates',
    loadChildren: () => import('./entities-modules/configuracoes/configuracoes.module').then(m => m.ConfiguracoesModule),
    canLoad: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/pages/miscellaneous/error' //Error 404 - Page not found
  }
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes, {
      scrollPositionRestoration: 'enabled', // Add options right here
      relativeLinkResolution: 'legacy'
    }),
    TranslateModule.forRoot(),

    //NgBootstrap
    NgbModule,
    ToastrModule.forRoot(),

    // Core modules
    CoreModule.forRoot(coreConfig),
    CoreCommonModule,
    CoreSidebarModule,
    CoreThemeCustomizerModule,

    // App modules
    LayoutModule
  ],

  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'pt-BR'
    },
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter } 
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
