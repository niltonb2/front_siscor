import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { PortalComponent } from './portal.componenet';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutComponent } from './checkout/checkout.component';
import { SharedModule } from 'app/components/shared.module';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { DadosEstabelecimentoComponent } from './dados-estabelecimento/dados-estabelecimento.component';
import { ErroPagamentoComponent } from './erro-pagamento/erro-pagamento.component';
import { SucessoPagamentoComponent } from './sucesso-pagamento/sucesso-pagamento.component';

const routes: Routes = [
  {
    path: '',
    component: PortalComponent
  }
]

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};
@NgModule({
  declarations: [
    PortalComponent,
    CheckoutComponent,
    DadosEstabelecimentoComponent,
    ErroPagamentoComponent,
    SucessoPagamentoComponent
  ],
  imports: [
    CommonModule,
    CoreCommonModule,
    ContentHeaderModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    RouterModule.forChild(routes),
    NgxMaskModule.forRoot(options),
    SharedModule
  ],

  providers: []
})
export class PortalModule {}