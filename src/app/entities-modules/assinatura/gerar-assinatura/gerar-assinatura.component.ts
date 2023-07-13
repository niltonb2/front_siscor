import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ICliente } from '@core/types/ICliente';
import { IPlano } from '@core/types/IPlano';
import { App } from 'app/app';
import { ClienteService } from 'app/entities-modules/pessoa/cadastro-cliente/cliente.service';
import { PlanoService } from 'app/entities-modules/plano/plano.service';
import { Token } from 'app/Utils/token';
import { Subscription } from 'rxjs';
import { NgbModal, ModalDismissReasons, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ResumoAssinaturaComponent } from 'app/components/resumo-assinatura/resumo-assinatura.component';
import { AssinaturaService } from '../assinatura.service';
import { ICobranca } from '@core/types/ICobranca';
import { CobrancaService } from 'app/entities-modules/cobranca/cobranca.service';
import { ButtonAlertService } from 'app/layout/components/button-alert/button-alert.service';

@Component({
  selector: 'app-gerar-assinatura',
  templateUrl: './gerar-assinatura.component.html',
  styleUrls: ['./gerar-assinatura.component.scss']
})
export class GerarAssinaturaComponent implements OnInit {;

  public submitted = false;
  closeResult = '';

  cadastroCliente: boolean;
  cadastroPlano: boolean;

  clientesPorEstabelecimentos: ICliente[] = [];
  planosPorEstabelecimentos: IPlano[] = [];
  subs: Subscription[] = [];

  clienteSelecionado: ICliente;
  planoSelecionado: IPlano;

  formularioAssinatura = new FormGroup({
    pessoa: new FormControl('', Validators.required),
    plano: new FormControl('', Validators.required),
    data_inicio: new FormControl(''),
    data_fim: new FormControl(''),
    observacoes: new FormControl('')
  })

    resumo_empresa: string;
    resumo_cliente: string;
    resumo_plano: string;
    resumo_valorParcela: string;
    resumo_dataInicio: string;
    resumo_dataFim: string;

  diasMes: string[] = ['01','05','10','15','20','25','30']
  vencimentoDia: string;
  dataParaFormatar;

  bodyCobranca;

  constructor(
    private clienteService: ClienteService,
    private planoService: PlanoService,
    private modalService: NgbModal,
    private assinaturaService: AssinaturaService,
    private cobrancaService: CobrancaService,
    private buttonAlertService: ButtonAlertService
  ) { 
  }

  ngOnInit(): void {

    this.resumo_empresa = App.Instance.estabelecimentoSelecionado

    const sub1 = this.clienteService.mostrarCadastroCliente.subscribe({ next: value => this.cadastroCliente = value })
    const sub2 = this.planoService.mostrarTelaPlano.subscribe({ next: v => this.cadastroPlano = v })
    this.subs.push(sub1, sub2)

  }

  get f_assinatura() {
    return this.formularioAssinatura.controls;
  }

  visualizarAssinatura() {

    this.submitted = true;

    if (this.formularioAssinatura.invalid) {
      return;
    }

    const idEstabelecimento = App.Instance.userInfo.estabelecimento_selecionado ? App.Instance.userInfo.estabelecimento_selecionado : Token.get('estabelecimento') 

    const hoje = new Date();
    const formated = (new Intl.DateTimeFormat('pt-br')).format(hoje);
    const dataNumbers = formated.split('/');

    const bodyAssinatura = {
      "estabelecimento": idEstabelecimento,
      "status": "ativo",
      "data_inicio": `${this.vencimentoDia}/${dataNumbers[1]}/${dataNumbers[2]}`,
      "data_fim": `${this.vencimentoDia}/${dataNumbers[1]}/${parseInt(dataNumbers[2]) + 1}`,
      "pessoa": this.formularioAssinatura.value.pessoa.id,
      "plano": this.formularioAssinatura.value.plano.id,
      "observacoes": {
        "info": this.formularioAssinatura.value.observacoes
      }
    }

    this.dataParaFormatar = `${this.vencimentoDia}/${dataNumbers[1]}/${dataNumbers[2]}`

    const bodyCob = {
      "valor": this.formularioAssinatura.value.plano.valor,
      "valor_original": this.formularioAssinatura.value.plano.valor,
      "estabelecimento": idEstabelecimento,
      "pessoa": this.formularioAssinatura.value.pessoa.id,
      "observacao": "",
      "metadados_descricao": "",
      "metadados_valor": "",
      "tipo": 3,
      "status": "aberto",
      "usuario": App.Instance.userInfo.id
    }

    this.bodyCobranca = bodyCob;

    this.assinaturaService.dadosAssinaturaParaGerar.next(bodyAssinatura);
    this.assinaturaService.dadosParaResumoAssinatura.next({
      empresa: App.Instance.estabelecimentoSelecionado,
      cliente: this.formularioAssinatura.value.pessoa.nome,
      plano: this.formularioAssinatura.value.plano.descricao,
      valor_parcela: this.formularioAssinatura.value.plano.valor,
      data_inicio: `${this.vencimentoDia}/${dataNumbers[1]}/${dataNumbers[2]}`,
      data_fim: `${this.vencimentoDia}/${dataNumbers[1]}/${parseInt(dataNumbers[2]) + 1}`
    })

    this.openResumoAssinatura();

  }

  onChange() {
    const idEstabelecimento = App.Instance.userInfo.estabelecimento_selecionado ? App.Instance.userInfo.estabelecimento_selecionado : Token.get('estabelecimento');
    this.clienteService.buscarClientesCobranca(idEstabelecimento)
      .subscribe({
        next: array => this.clientesPorEstabelecimentos = array,
        error: e => console.log(e)
      })
  }

  getPlanos() {
    this.planoService.getPlanos()
      .subscribe({
        next: array => this.planosPorEstabelecimentos = array,
        error: e => console.log(e)
      })
  }

  mostrarCadastroCliente() {
    this.clienteService.mostrarCadastroCliente.next(true);
  }

  fecharTelaCadastroCliente() {
    this.clienteService.mostrarCadastroCliente.next(false);
  }

  mostrarCadastroPlano() {
    this.planoService.mostrarTelaPlano.next(true);
  }


  fecharTelaCadastroPlano() {
    this.planoService.mostrarTelaPlano.next(false);
  }

  openResumoAssinatura() {
    this.modalService.open(
      ResumoAssinaturaComponent,
      {
        ariaLabelledBy: 'modal-basic-title',
        centered: true
      }).result.then(
        (result) => {
          
        },
        (reason) => {

          setTimeout(() => {
            this.onAlert('As cobranças estão sendo geradas', 'warning')
          }, 3000)

          this.submitted = false;
          this.formularioAssinatura.reset();
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

          let contagem = 0;
          let dataSplit = this.dataParaFormatar.split('/');
          let dataInicial = new Date(dataSplit[2], dataSplit[1], dataSplit[0]);
          let dataRef = new Date();

          let geracaoCobrancas = setInterval(() => {
            dataRef.setDate(dataInicial.getDate() + 30)
            let dataAgora = (new Intl.DateTimeFormat('pt-br')).format(dataRef)
            console.log(dataAgora)

            let bodyCobGerar = {
              ...this.bodyCobranca,
              data_vencimento: dataAgora
            }

            this.cobrancaService.gerarCobranca(bodyCobGerar)
            .subscribe({
              next: res => {
      
              },
              error: e => {
                console.log(e)
              }
            })

            contagem += 1;
            if(contagem == 12){
              this.pararGeracaoCobs(geracaoCobrancas)
              this.onAlert('Cobranças da assinatura foram geradas com sucesso', 'primary')
            }
          }, 500)

        },
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  pararGeracaoCobs(geracaoCobrancas){
    clearInterval(geracaoCobrancas);
  }

  onAlert(info: string, status: string) {
    this.buttonAlertService.fieldAlert.next(true)
    this.buttonAlertService.status.next(status)
    this.buttonAlertService.message.next(info)
    setTimeout(() => {
      this.buttonAlertService.fieldAlert.next(false)
    }, 5000)
  }

}
