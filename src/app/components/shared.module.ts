import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardPrincipalComponent } from './card-principal/card-principal.component';
import { CoreDirectivesModule } from '@core/directives/directives';
import { CadastroEstabelecimentoComponent } from 'app/entities-modules/estabelecimento/cadastro-estabelecimento/cadastro-estabelecimento.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonAlertComponent } from 'app/layout/components/button-alert/button-alert.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { ModalSelectComponent } from './modal-select/modal-select.component';
import { TablePrincipalComponent } from './table-principal/table-principal.component';
import { CadastroClienteComponent } from 'app/entities-modules/pessoa/cadastro-cliente/cadastro-cliente.component';
import { ModalConfirmarComponent } from './modal-confirmar/modal-confirmar.component';
import { ConfigInicialComponent } from './config-inicial/config-inicial.component';
import { ModalCadastroComponent } from 'app/entities-modules/estabelecimento/modal-cadastro/modal-cadastro.component';
import { VisualizarEditarClienteComponent } from 'app/entities-modules/pessoa/visualizar-editar-cliente/visualizar-editar-cliente.component';
import { VisualizarEditarEstabelecimentoComponent } from 'app/entities-modules/estabelecimento/visualizar-editar-estabelecimento/visualizar-editar-estabelecimento.component';
import { CadastroPessoaClienteComponent } from 'app/entities-modules/pessoa/cadastro-pessoa-cliente/cadastro-pessoa-cliente.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { GerarCobrancaComponent } from 'app/entities-modules/cobranca/gerar-cobranca/gerar-cobranca.component';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { MoedaPipe } from 'app/Utils/moeda.pipe';
import { CpfPipe } from 'app/Utils/cpf.pipe';
import { CnpjPipe } from 'app/Utils/cnpj.pipe';
import { DatePipe } from 'app/Utils/date.pipe'
import { TableCobrancaComponent } from './table-cobranca/table-cobranca.component';
import { SelecionarEstabelecimentoComponent } from './selecionar-estabelecimento/selecionar-estabelecimento.component';
import { VisualizacaoCobrancaComponent } from './visualizacao-cobranca/visualizacao-cobranca.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { ModalAguardeComponent } from './modal-aguarde/modal-aguarde.component';
import { DatafromtoComponent } from './datafromto/datafromto.component';
import { FiltrostatusComponent } from './filtrostatus/filtrostatus.component';
import { ChartDashComponent } from './chart-dash/chart-dash.component';
import { ChartsModule } from 'ng2-charts';
import { InfosFieldComponent } from './infos-field/infos-field.component';
import { GerarProdutoComponent } from 'app/entities-modules/produto/gerar-produto/gerar-produto.component';
import { TableProdutoComponent } from './table-produto/table-produto.component';
import { TablePlanoComponent } from './table-plano/table-plano.component';
import { GerarPlanoComponent } from 'app/entities-modules/plano/gerar-plano/gerar-plano.component';
import { ModalInfosPlanoComponent } from './modal-infos-plano/modal-infos-plano.component';
import { VisualizarEditarProdutoComponent } from 'app/entities-modules/produto/visualizar-editar-produto/visualizar-editar-produto.component';
import { VisualizarEditarPlanoComponent } from 'app/entities-modules/plano/visualizar-editar-plano/visualizar-editar-plano.component';
import { GerarAssinaturaComponent } from 'app/entities-modules/assinatura/gerar-assinatura/gerar-assinatura.component';
import { ResumoAssinaturaComponent } from './resumo-assinatura/resumo-assinatura.component';
import { TableTemplateComponent } from './table-template/table-template.component';


export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};
@NgModule({
    declarations: [
        CardPrincipalComponent,
        CadastroEstabelecimentoComponent,
        ButtonAlertComponent,
        ModalSelectComponent,
        TablePrincipalComponent,
        CadastroClienteComponent,
        ModalConfirmarComponent,
        ConfigInicialComponent,
        ModalCadastroComponent,
        VisualizarEditarClienteComponent,
        VisualizarEditarEstabelecimentoComponent,
        CadastroPessoaClienteComponent,
        GerarCobrancaComponent,
        MoedaPipe,
        CpfPipe,
        CnpjPipe,
        DatePipe,
        TableCobrancaComponent,
        SelecionarEstabelecimentoComponent,
        VisualizacaoCobrancaComponent,
        SpinnerComponent,
        ModalAguardeComponent,
        DatafromtoComponent,
        FiltrostatusComponent,
        ChartDashComponent,
        InfosFieldComponent,
        GerarProdutoComponent,
        TableProdutoComponent,
        TablePlanoComponent,
        GerarPlanoComponent,
        ModalInfosPlanoComponent,
        VisualizarEditarProdutoComponent,
        VisualizarEditarPlanoComponent,
        GerarAssinaturaComponent,
        ResumoAssinaturaComponent,
        TableTemplateComponent
    ],
    imports: [
        CommonModule,
        CoreDirectivesModule,
        ReactiveFormsModule,
        NgbModule,
        NgSelectModule,
        NgxMaskModule.forRoot(options),
        FormsModule,
        NgxDatatableModule,
        Ng2FlatpickrModule,
        CardSnippetModule,
        CurrencyMaskModule,
        ChartsModule
    ],
    exports: [
        CardPrincipalComponent,
        CadastroEstabelecimentoComponent,
        ButtonAlertComponent,
        ModalSelectComponent,
        TablePrincipalComponent,
        CadastroClienteComponent,
        ModalConfirmarComponent,
        ConfigInicialComponent,
        ModalCadastroComponent,
        VisualizarEditarClienteComponent,
        VisualizarEditarEstabelecimentoComponent,
        CadastroPessoaClienteComponent,
        GerarCobrancaComponent,
        TableCobrancaComponent,
        SelecionarEstabelecimentoComponent,
        VisualizacaoCobrancaComponent,
        SpinnerComponent,
        ModalAguardeComponent,
        DatafromtoComponent,
        FiltrostatusComponent,
        ChartDashComponent,
        InfosFieldComponent,
        GerarProdutoComponent,
        TableProdutoComponent,
        TablePlanoComponent,
        GerarPlanoComponent,
        ModalInfosPlanoComponent,
        VisualizarEditarProdutoComponent,
        VisualizarEditarPlanoComponent,
        GerarAssinaturaComponent,
        ResumoAssinaturaComponent,
        TableTemplateComponent
    ]
})

export class SharedModule { }