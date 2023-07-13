import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ICobranca } from '@core/types/ICobranca';
import { NgbActiveModal, NgbModal, ModalDismissReasons, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { PortalClienteService } from '../portal-cliente.service';
import Stepper from 'bs-stepper';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IParcelamento } from '@core/types/IParcelamento';
import { ErroPagamentoComponent } from '../erro-pagamento/erro-pagamento.component';
import { ModalAguardeComponent } from 'app/components/modal-aguarde/modal-aguarde.component';
import { SucessoPagamentoComponent } from '../sucesso-pagamento/sucesso-pagamento.component';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {

  public submitted = false;
  public msgBotao: string = 'Gerar Boleto';

  @ViewChild(ModalAguardeComponent, { static: true })
  modalAguardeComponent: ModalAguardeComponent;

  modalAguarde;

  bandeira: string;

  closeResult = '';

  estadosBrasileiros: string[] = [
    "Acre",
    "Alagoas",
    "Amapá",
    "Amazonas",
    "Bahia",
    "Ceará",
    "Distrito Federal",
    "Espírito Santo",
    "Goiás",
    "Maranhão",
    "Mato Grosso",
    "Mato Grosso do Sul",
    "Minas Gerais",
    "Pará",
    "Paraíba",
    "Paraná",
    "Pernambuco",
    "Piauí",
    "Rio de Janeiro",
    "Rio Grande do Norte",
    "Rigo Grande do Sul",
    "Rondônia",
    "Roraima",
    "Santa Catarina",
    "São Paulo",
    "Sergipe",
    "Tocantins"
  ];

  ufs: string[] = [
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO"
  ];

  parcelamento: IParcelamento[] = []

  pagamentoSelecionado: string = 'boleto'

  dadosDaCobranca: ICobranca;

  subs: Subscription[] = [];

  formularioCheckout = new FormGroup({
    documento: new FormControl('', Validators.required),
    nome: new FormControl('', Validators.required),
    celular: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    cep: new FormControl('', Validators.required),
    logradouro: new FormControl('', Validators.required),
    numero: new FormControl(''),
    complemento: new FormControl(''),
    bairro: new FormControl('', Validators.required),
    uf: new FormControl('', Validators.required),
    cidade: new FormControl('', Validators.required),
    numero_cartao: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.minLength(16)]),
    nome_cartao: new FormControl({ value: '', disabled: false }, Validators.required),
    vencimento_cartao: new FormControl({ value: '', disabled: false }, Validators.required),
    cvv_cartao: new FormControl({ value: '', disabled: false }, Validators.required),
    pagar_em: new FormControl({ value: this.parcelamento[0], disabled: false }, Validators.required)
  })

  private verticalWizardStepper: Stepper;

  constructor(
    private activeModal: NgbActiveModal,
    private portalClienteService: PortalClienteService,
    private modalService: NgbModal,
    config: NgbModalConfig
  ) { }

  ngOnInit(): void {
    const sub = this.portalClienteService.cobrancaParaPagamento.subscribe({ next: cob => {
      this.dadosDaCobranca = cob
    } })
    this.subs.push(sub)

    this.verificarParcelas(this.dadosDaCobranca);
    this.popularFormulario(this.dadosDaCobranca)

    this.verticalWizardStepper = new Stepper(document.querySelector('#cadastroEstabelecimento'), {
      linear: false,
      animation: true
    });
  }

  verificarParcelas(cobranca: ICobranca) {
    let valorCobranca = parseFloat(cobranca.valor);

    if (valorCobranca > this.dadosDaCobranca.valor_min_parcelas) {
      for (let i = 1; valorCobranca >= this.dadosDaCobranca.valor_min_parcelas; i++) {
        let valorParcelado = valorCobranca / i;
        let quantidadeParcelas = i;
        this.parcelamento.push({ quantidade: quantidadeParcelas, valor: valorParcelado })
        if (valorParcelado < this.dadosDaCobranca.valor_min_parcelas || i == this.dadosDaCobranca.qtde_max_parcelas)
          break;
      }
    } else {
      this.parcelamento.push({ quantidade: 1, valor: valorCobranca })
    }
    let valorParcelaBoleto = this.parcelamento[0].valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    this.formularioCheckout.controls.pagar_em.setValue(`${this.parcelamento[0].quantidade}x de ${valorParcelaBoleto}`)
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  dismissModal() {
    this.activeModal.dismiss();
  }

  closeModal() {
    this.activeModal.close();
  }

  get f_checkout() {
    return this.formularioCheckout.controls;
  }

  pagar() {
    this.submitted = true;

    if (this.pagamentoSelecionado == 'boleto') {
      this.modalAguarde = this.modalService.open(ModalAguardeComponent, { centered: true });

      const bodyPagamentoBoleto = {
        "endereco": this.formularioCheckout.value.logradouro,
        "numero_endereco": this.formularioCheckout.value.numero,
        "parcelas": this.parcelamento[0].quantidade,
        "valor": this.parcelamento[0].valor,
        "forma_pagamento": "boleto",
        "id": this.dadosDaCobranca.cobranca_id,
        "gateway": this.dadosDaCobranca.gateway_nome,
        "tipo_pessoa": this.formularioCheckout.value.documento.length == 11 ? 'F' : 'J',
        "estado": this.formularioCheckout.value.uf,
        "nome": this.formularioCheckout.value.nome,
        "documento": this.formularioCheckout.value.documento,
        "email": this.formularioCheckout.value.email,
        "celular": this.formularioCheckout.value.celular,
        "cep": this.formularioCheckout.value.cep,
        "cidade": this.formularioCheckout.value.cidade,
        "bairro": this.formularioCheckout.value.bairro,
        "complemento": this.formularioCheckout.value.complemento
      }
      this.portalClienteService.gerarBoleto(bodyPagamentoBoleto, this.dadosDaCobranca.marketplace_id)
        .subscribe({
          next: res => {
            console.log(res[0].url_boleto)
            window.open(res[0].url_boleto, "_blank");
            this.submitted = false;
            this.modalAguarde.close();
            this.openModalSucessoPagamento();
            setTimeout(() => {
              this.closeModal();
            }, 1500);
          },
          error: e => {
            this.modalAguarde.close();
            this.openModalErroPagamento();
            console.log(e)
          }
        })
    } else {

      if (this.formularioCheckout.invalid) {
        return;
      }
      this.modalAguarde = this.modalService.open(ModalAguardeComponent, { centered: true });

      const vencimento = this.formularioCheckout.value.vencimento_cartao.split('')
      let bandeiraCartao;

      if (this.bandeira == 'MASTER_CARD') {
        bandeiraCartao = 'mastercard'
      } else if (this.bandeira == 'HIPERCARD') {
        bandeiraCartao = 'hipercard'
      } else if (this.bandeira == 'VISA') {
        bandeiraCartao = 'visa'
      } else if (this.bandeira == 'AMERICAN_EXPRESS') {
        bandeiraCartao = 'american-express'
      } else if (this.bandeira == 'DINERS_CLUB') {
        bandeiraCartao = 'diners-club'
      }

      const bodyPagamentoCartao = {
        "endereco": this.formularioCheckout.value.logradouro,
        "numero_endereco": this.formularioCheckout.value.numero,
        "parcelas": this.formularioCheckout.value.pagar_em.quantidade ? this.formularioCheckout.value.pagar_em.quantidade : this.parcelamento[0].quantidade,
        "valor": this.formularioCheckout.value.pagar_em.valor ? this.formularioCheckout.value.pagar_em.valor : this.parcelamento[0].valor,
        "forma_pagamento": "credit",
        "id": this.dadosDaCobranca.cobranca_id,
        "gateway": this.dadosDaCobranca.gateway_nome,
        "tipo_pessoa": this.formularioCheckout.value.documento.length == 11 ? 'F' : 'J',
        "estado": this.formularioCheckout.value.uf,
        "nome": this.formularioCheckout.value.nome,
        "documento": this.formularioCheckout.value.documento,
        "email": this.formularioCheckout.value.email,
        "celular": this.formularioCheckout.value.celular,
        "cep": this.formularioCheckout.value.cep,
        "cidade": this.formularioCheckout.value.cidade,
        "bairro": this.formularioCheckout.value.bairro,
        "complemento": this.formularioCheckout.value.complemento,
        "num_cartao": this.formularioCheckout.value.numero_cartao,
        "mes_cartao": vencimento[0] + vencimento[1],
        "ano_cartao": vencimento[2] + vencimento[3],
        "nome_cartao": this.formularioCheckout.value.nome_cartao,
        "cvv_cartao": this.formularioCheckout.value.cvv_cartao,
        "metodo": bandeiraCartao
      }

      this.portalClienteService.gerarBoleto(bodyPagamentoCartao, this.dadosDaCobranca.marketplace_id)
        .subscribe({
          next: res => {
            this.submitted = false;
            this.modalAguarde.close();
            this.openModalSucessoPagamento();
            setTimeout(() => {
              this.closeModal();
            }, 1500);
          },
          error: e => {
            this.modalAguarde.close();
            this.openModalErroPagamento();
            console.log(e)
          }
        })
    }
  }

  selecaoPagamento(pag: string) {
    this.pagamentoSelecionado = pag;
    if (pag == 'boleto') {
      this.formularioCheckout.controls.numero_cartao.disable();
      this.formularioCheckout.controls.nome_cartao.disable();
      this.formularioCheckout.controls.vencimento_cartao.disable();
      this.formularioCheckout.controls.cvv_cartao.disable();

      let valorParcelaBoleto = this.parcelamento[0].valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      this.formularioCheckout.controls.pagar_em.setValue(`${this.parcelamento[0].quantidade}x de ${valorParcelaBoleto}`)

      this.bandeira = ''
      this.formularioCheckout.controls.numero_cartao.setValue('');
      this.formularioCheckout.controls.nome_cartao.setValue('');
      this.formularioCheckout.controls.vencimento_cartao.setValue('');
      this.formularioCheckout.controls.cvv_cartao.setValue('');

      this.formularioCheckout.controls.pagar_em.disable();

      this.msgBotao = 'Gerar Boleto'

    } else {
      this.formularioCheckout.controls.numero_cartao.enable();
      this.formularioCheckout.controls.nome_cartao.enable();
      this.formularioCheckout.controls.vencimento_cartao.enable();
      this.formularioCheckout.controls.cvv_cartao.enable();
      this.formularioCheckout.controls.pagar_em.enable();

      this.msgBotao = 'Efetuar Pagamento'
    }
  }

  popularFormulario(cobranca: ICobranca) {
    this.formularioCheckout.controls.documento.setValue(cobranca.cliente_documento)
    this.formularioCheckout.controls.nome.setValue(cobranca.cliente_nome)
    this.formularioCheckout.controls.celular.setValue(cobranca.celular)
    this.formularioCheckout.controls.email.setValue(cobranca.email)
    this.formularioCheckout.controls.cep.setValue(cobranca.cep)
    this.formularioCheckout.controls.logradouro.setValue(cobranca.logradouro)
    this.formularioCheckout.controls.numero.setValue(cobranca.numero)
    this.formularioCheckout.controls.complemento.setValue(cobranca.complemento)
    this.formularioCheckout.controls.bairro.setValue(cobranca.bairro)
    this.formularioCheckout.controls.uf.setValue(cobranca.uf)
    this.formularioCheckout.controls.cidade.setValue(cobranca.cidade)
  }

  verticalWizardNext() {
    this.verticalWizardStepper.next();
  }

  verticalWizardPrevious() {
    this.verticalWizardStepper.previous();
  }

  openModalErroPagamento() {
    this.modalService.open(
      ErroPagamentoComponent,
      {
        ariaLabelledBy: 'modal-basic-title',
        centered: true
      }).result.then(
        (result) => {
          console.log(result)
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        },
      );
  }

  openModalSucessoPagamento() {
    this.modalService.open(
      SucessoPagamentoComponent,
      {
        ariaLabelledBy: 'modal-basic-title',
        centered: true
      }).result.then(
        (result) => {
          console.log(result)
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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

  getCreditCardType(s) {

    var ccnumber = s.replace(/\D/g, "");
    var result = "";

    if (/^(401178|401179|431274|438935|451416|457393|457631|457632|504175|627780|636297|636368|(506699|5067[0-6]\d|50677[0-8])|(50900\d|5090[1-9]\d|509[1-9]\d{2})|65003[1-3]|(65003[5-9]|65004\d|65005[0-1])|(65040[5-9]|6504[1-3]\d)|(65048[5-9]|65049\d|6505[0-2]\d|65053[0-8])|(65054[1-9]|6505[5-8]\d|65059[0-8])|(65070\d|65071[0-8])|65072[0-7]|(65090[1-9]|65091\d|650920)|(65165[2-9]|6516[6-7]\d)|(65500\d|65501\d)|(65502[1-9]|6550[3-4]\d|65505[0-8]))[0-9]{10,12}$/.test(ccnumber)) {
      result = 'ELO'
    }
    else if (/^(((606282)\d{0,10})|((3841)\d{0,12}))$/.test(ccnumber)) {
      result = 'HIPERCARD'
    }
    else if (/^[5|2][1-5][0-9]{14}$/.test(ccnumber)) {
      result = 'MASTER_CARD'
    }
    else if (/^4[0-9]{12}([0-9]{3})?$/.test(ccnumber)) {
      result = 'VISA'
    }
    else if (/^3[47][0-9]{13}$/.test(ccnumber)) {
      result = 'AMERICAN_EXPRESS';
    }
    else if (/^3(0[0-5]|[68][0-9])[0-9]{11}$/.test(ccnumber)) {
      result = 'DINERS_CLUB'
    }

    if (result) this.bandeira = result;
  }
}
