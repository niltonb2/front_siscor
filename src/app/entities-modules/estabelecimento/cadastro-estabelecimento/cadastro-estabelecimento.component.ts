import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import Stepper from 'bs-stepper';
import { ButtonAlertService } from 'app/layout/components/button-alert/button-alert.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EstabelecimentoService } from './estabelecimento.service';
import { DadosService } from 'app/entities-modules/dados/dados.service';
import { Router } from '@angular/router';
import { ClienteService } from 'app/entities-modules/pessoa/cadastro-cliente/cliente.service';
import { Subscription } from 'rxjs';
import { UserService } from 'app/auth/service';
import { App } from 'app/app';
import { NgbModal, ModalDismissReasons, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerComponent } from 'app/components/spinner/spinner.component';
import { IEstabelecimento } from '@core/types/IEstabelecimento';
import { IContato } from '@core/types/IContato';
import { IEndereco } from '@core/types/IEndereco';
import { IGateway } from '@core/types/IGateway';


@Component({
  selector: 'app-cadastro-estabelecimento',
  templateUrl: './cadastro-estabelecimento.component.html',
  styleUrls: ['./cadastro-estabelecimento.component.scss']
})
export class CadastroEstabelecimentoComponent implements OnInit, OnDestroy {


  public selectBasic: String[] = ['Zoop', 'Pagarme'];
  public selectBasicLoading = false;
  public selected;
  public permitirCartao: boolean = false;
  public classInputCartao: boolean = false;

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

  public estabelecimento: IEstabelecimento;
  public contato: IContato;
  public endereco: IEndereco;
  public gateway: IGateway;

  subs: Subscription[] = [];
  public submitted = false;
  public loading = false;
  public fieldAlert: boolean = false;
  public message: string = '';
  public status: string = '';
  public idEntidadeParaCadastroDeDados: number;

  formularioEstabelecimento = new FormGroup({
    nome: new FormControl('', Validators.required),
    fantasia: new FormControl(''),
    documento: new FormControl('', Validators.required),
    telefone: new FormControl(''),
    celular: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    telefone_comercial: new FormControl(''),
    cep: new FormControl('', Validators.required),
    numero: new FormControl(''),
    complemento: new FormControl(''),
    logradouro: new FormControl('', Validators.required),
    bairro: new FormControl('', Validators.required),
    cidade: new FormControl('', Validators.required),
    uf: new FormControl('', Validators.required),
    nome_gateway: new FormControl('', Validators.required),
    marketplace_id: new FormControl('', Validators.required),
    seller_id: new FormControl('', Validators.required),
    valor_min_parcelas: new FormControl('10'),
    qtde_max_parcelas: new FormControl('1')
  })


  private verticalWizardStepper: Stepper;

  @Output() cadastroEstabelecimentoEvento = new EventEmitter<any>();

  constructor(
    private estabelecimentoService: EstabelecimentoService,
    private buttonAlertService: ButtonAlertService,
    private clienteService: ClienteService,
    private dadosService: DadosService,
    private _userService: UserService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.verticalWizardStepper = new Stepper(document.querySelector('#cadastroEstabelecimento'), {
      linear: false,
      animation: true
    });

    this.formularioEstabelecimento.controls.nome_gateway.setValue('zoop');
  }

  get f_estabelecimento() {
    return this.formularioEstabelecimento.controls;
  }

  get f_estabelecimentoValue() {
    return this.formularioEstabelecimento.value;
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => {
      sub.unsubscribe();
    })
  }

  cadastrarEstabelecimento() {
    this.submitted = true;

    if (this.formularioEstabelecimento.invalid) {
      this.onAlert('Restam campos a serem preenchidos', 'danger')
      return;
    }

    this.spinnerOpen();

    this.loading = true;

    const {
      nome,
      fantasia,
      documento,
      telefone,
      celular,
      email,
      telefone_comercial,
      cep,
      numero,
      complemento,
      logradouro,
      bairro,
      cidade,
      uf,
      nome_gateway,
      marketplace_id,
      seller_id,
      valor_min_parcelas,
      qtde_max_parcelas
    } = this.formularioEstabelecimento.value

    this.estabelecimento = {
      documento,
      nome,
      fantasia,
      tipo_documento: documento.length == 11 ? 'F' : 'J'
    }

    this.contato = {
      celular,
      email,
      telefone
    }

    this.endereco = {
      tipo_endereco: "P",
      bairro,
      cep,
      cidade,
      logradouro,
      uf,
      complemento,
      numero
    }

    this.gateway = {
      nome: nome_gateway,
      marketplace_id,
      seller_id,
      pagamento_cartao: this.permitirCartao,
      valor_min_parcelas,
      qtde_max_parcelas
    }

    const dataSeller = {
      "name": this.formularioEstabelecimento.value.nome,
      "gateway_marketplace_id": this.formularioEstabelecimento.value.marketplace_id,
      "gateway_seller_id": this.formularioEstabelecimento.value.seller_id,
      "document": this.formularioEstabelecimento.value.documento,
      "phone_number": this.formularioEstabelecimento.value.celular,
      "email": this.formularioEstabelecimento.value.email,
      "address": {
        "city": this.formularioEstabelecimento.value.cidade,
        "state": this.formularioEstabelecimento.value.uf,
        "neighborhood": this.formularioEstabelecimento.value.bairro,
        "postal_code": this.formularioEstabelecimento.value.cep,
        "line1": this.formularioEstabelecimento.value.logradouro
      }
    }
    //validar seller
    /* this.estabelecimentoService.criarSeller(dataSeller)
      .subscribe({
        next: res => {
        },
        error: e => {
          this.spinnerClose();
          this.loading = false;
          this.onAlert(e.error.message, 'danger')
        }
      }) */

    this.estabelecimentoService.cadastrar(this.estabelecimento)
      .subscribe({
        next: value => {
          this.idEntidadeParaCadastroDeDados = value.idEstabelecimento;
          this.selecionarEstabelecimentoCadastrado(value.idEstabelecimento);
          this.cadastrarContato(this.contato, this.endereco, this.gateway);
        },
        error: e => {
          this.spinnerClose();
          this.loading = false;
          this.onAlert(e.error.info, 'danger')
        }
      })
  }

  cadastrarContato(contato: IContato, endereco: IEndereco, gateway: IGateway) {
    this.dadosService.cadastrarContato('estabelecimento', this.idEntidadeParaCadastroDeDados, contato)
      .subscribe({
        next: value => {
          this.cadastrarEndereco(endereco, gateway)
        },
        error: e => {
          this.spinnerClose();
          this.loading = false;
          this.onAlert(e.error.info, 'danger')
        }
      })

  }

  cadastrarEndereco(endereco: IEndereco, gateway: IGateway) {
    this.dadosService.cadastrarEndereco('estabelecimento', this.idEntidadeParaCadastroDeDados, endereco)
      .subscribe({
        next: value => {
          this.cadastrarGateway(gateway)
        },
        error: e => {
          this.spinnerClose();
          this.loading = false;
          this.onAlert(e.error.info, 'danger')
        }
      })
  }

  cadastrarGateway(gateway: IGateway) {
    this.estabelecimentoService.cadastrarGateway(gateway)
      .subscribe({
        next: value => {
          this.spinnerClose();
          this.onAlert('Cadastro realizado com sucesso.', 'primary')
          this.submitted = false;
          this.vincularGatewayAoEstabelecimento(value[0].id)
          //this.estabelecimentoService.mostrarCadastroEstabelecimento.next(false);
        },
        error: e => {
          this.spinnerClose();
          this.loading = false;
          this.onAlert(e.error.info, 'danger')
        }
      })
  }

  vincularGatewayAoEstabelecimento(id_gateway) {
    this.estabelecimentoService.setGateway(this.idEntidadeParaCadastroDeDados, id_gateway)
      .subscribe({
        next: value => {
          window.location.reload()
        },
        error: e => {
          console.log(e)
        }
      })
  }

  informarConfigGatewayNoEstabelecimento() {
    const configGateway = {
      "gateway_is_configured": true
    }
    this.estabelecimentoService.setConfig(this.idEntidadeParaCadastroDeDados, configGateway)
      .subscribe({
        next: v => {

        },
        error: e => { }
      })
  }

  selecionarEstabelecimentoCadastrado(estabelecimento) {
    this._userService.selecionarEstabelecimento(App.Instance.userInfo.id, estabelecimento)
      .subscribe({
        next: v => {

        },
        error: e => console.log(e)
      })
  }

  consultaCep() {
    this.clienteService.buscarEnderecoPeloCep(this.formularioEstabelecimento.value.cep)
      .subscribe({
        next: endereco => {

          this.formularioEstabelecimento.controls.bairro.setValue(endereco.bairro)
          this.formularioEstabelecimento.controls.cidade.setValue(endereco.localidade)
          this.formularioEstabelecimento.controls.logradouro.setValue(endereco.bairro)
          this.formularioEstabelecimento.controls.uf.setValue(endereco.uf)
          this.onAlert('Dados de endereço encontrados com sucesso.', 'primary')
        },
        error: e => {
          this.onAlert('Falha ao pesquisar CEP, tente novamente.', 'danger')
          console.log(e)
        }
      })
  }

  consultaCnpj() {

    this.estabelecimentoService.verificarSeEstabelecimentoJaExiste(this.formularioEstabelecimento.value.documento)
      .subscribe({
        next: v => {

          if (!v) {
            this.estabelecimentoService.buscarDadosEmpresa(this.formularioEstabelecimento.value.documento)
              .subscribe({
                next: empresa => {
                  this.formularioEstabelecimento.controls.fantasia.setValue(empresa.fantasia)
                  this.formularioEstabelecimento.controls.nome.setValue(empresa.nome)
                  this.formularioEstabelecimento.controls.telefone.setValue(empresa.telefone)
                  this.formularioEstabelecimento.controls.email.setValue(empresa.email)
                  this.formularioEstabelecimento.controls.numero.setValue(empresa.numero)
                  this.formularioEstabelecimento.controls.complemento.setValue(empresa.complemento)
                  //this.formularioEstabelecimento.controls.estado.setValue(empresa.estado)
                  const cep = empresa.cep.replace('.', '').replace('-', '')
                  this.formularioEstabelecimento.controls.cep.setValue(cep)
                  this.formularioEstabelecimento.controls.bairro.setValue(empresa.bairro)
                  this.formularioEstabelecimento.controls.cidade.setValue(empresa.municipio)
                  this.formularioEstabelecimento.controls.logradouro.setValue(empresa.logradouro)
                  this.formularioEstabelecimento.controls.uf.setValue(empresa.uf)
                  this.consultaCep()
                },
                error: error => console.log(error)
              })
          } else {
            const documento = this.formularioEstabelecimento.value.documento.length == 11 ? 'CPF' : 'CNPJ'
            this.onAlert(`${documento} já cadastrado.`, 'danger')
          }
        },
        error: e => {
          console.log(e)
        }
      })
  }

  fecharTelaCadastroEstabelecimento() {
    this.cadastroEstabelecimentoEvento.emit();
  }

  verticalWizardNext() {
    this.verticalWizardStepper.next();
  }

  verticalWizardPrevious() {
    this.verticalWizardStepper.previous();
  }

  onAlert(info: string, status: string) {
    this.buttonAlertService.fieldAlert.next(true)
    this.buttonAlertService.status.next(status)
    this.buttonAlertService.message.next(info)
    setTimeout(() => {
      this.buttonAlertService.fieldAlert.next(false)
    }, 3000)
  }

  spinnerOpen() {
    this.modalService.open(
      SpinnerComponent, {
      centered: true,
      size: 'xs'
    }).result.then(
      (result) => {

      },
      (reason) => {

      }
    )
  }

  spinnerClose() {
    this.modalService.dismissAll();
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

  onCheck(){
    this.permitirCartao = !this.permitirCartao;
  }

}
