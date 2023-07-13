import { Component, OnDestroy, OnInit } from '@angular/core';
import { App } from 'app/app';
import { ButtonAlertService } from 'app/layout/components/button-alert/button-alert.service';
import { Subscription } from 'rxjs';
import { EstabelecimentoService } from '../estabelecimento/cadastro-estabelecimento/estabelecimento.service';
import { ClienteService } from '../pessoa/cadastro-cliente/cliente.service';
import { CobrancaService } from './cobranca.service';

@Component({
  selector: 'app-cobranca',
  templateUrl: './cobranca.component.html',
  styleUrls: ['./cobranca.component.scss']
})
export class CobrancaComponent implements OnInit, OnDestroy {

  cadastro: boolean;
  cadastroCliente: boolean;
  subs: Subscription[] = [];

  constructor(
    private cobrancaService: CobrancaService,
    private clienteService: ClienteService,
    private estabelecimentoService: EstabelecimentoService,
    private buttonAlertService: ButtonAlertService
  ) { }

  ngOnInit(): void {
    const sub1 = this.cobrancaService.mostrarTelaCobranca.subscribe({next: v => this.cadastro = v})
    const sub2 = this.clienteService.mostrarCadastroCliente.subscribe({next: value => this.cadastroCliente = value})
    this.subs.push(sub1, sub2)
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
    this.fecharTelaCadastroCliente();
    this.cobrancaService.mostrarTelaCobranca.next(false);
  }

  mostrarTelaCadastro(){
    //aqui verifica se existe config de gateway...
    this.estabelecimentoService.buscarPorId(App.Instance.userInfo.estabelecimento_selecionado)
      .subscribe({
        next: ec => {
          if(!ec[0].configuracoes?.gateway_is_configured){
            this.cobrancaService.mostrarTelaCobranca.next(true);
          }else {
            this.onAlert('Configure o gateway para gerar cobranças', 'warning')
          }
        },
        error: e => {}
      })
  }

  fecharTelaCadastro(){
    this.cobrancaService.mostrarTelaCobranca.next(false);
  }

  mostrarCadastroCliente(){
    this.clienteService.mostrarCadastroCliente.next(true);
  }

  fecharTelaCadastroCliente() {
    this.clienteService.mostrarCadastroCliente.next(false);
  }

  onAlert(info: string, status: string) {
    this.buttonAlertService.fieldAlert.next(true)
    this.buttonAlertService.status.next(status)
    this.buttonAlertService.message.next(info)
    setTimeout(() => {
      this.buttonAlertService.fieldAlert.next(false)
    }, 4000)
  }

}
