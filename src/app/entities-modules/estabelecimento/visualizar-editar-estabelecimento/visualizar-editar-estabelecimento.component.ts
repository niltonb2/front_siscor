import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'app/auth/service';
import { DadosService } from 'app/entities-modules/dados/dados.service';
import { ClienteService } from 'app/entities-modules/pessoa/cadastro-cliente/cliente.service';
import { ButtonAlertService } from 'app/layout/components/button-alert/button-alert.service';
import { Subscription } from 'rxjs';
import { EstabelecimentoService } from '../cadastro-estabelecimento/estabelecimento.service';
import Stepper from 'bs-stepper';
import { App } from 'app/app';
import { IEstabelecimento } from '@core/types/IEstabelecimento';
import { IContato } from '@core/types/IContato';
import { IEndereco } from '@core/types/IEndereco';
import { IGateway } from '@core/types/IGateway';
import { NgbModal, ModalDismissReasons, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerComponent } from 'app/components/spinner/spinner.component';

@Component({
  selector: 'app-visualizar-editar-estabelecimento',
  templateUrl: './visualizar-editar-estabelecimento.component.html',
  styleUrls: ['./visualizar-editar-estabelecimento.component.scss']
})
export class VisualizarEditarEstabelecimentoComponent implements OnInit, OnDestroy {

  @Output() edicaoEstabelecimentoEvento = new EventEmitter<any>();

  public selectBasic: String[] = ['Zoop', 'Pagarme'];
  public selectBasicLoading = false;
  public selected;
  public permitirCartao: boolean = false;

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

    this.estabelecimentoService.estabelecimentoParaEditar.subscribe({
      next: estabelecimento => {
        /* Dados Principais */
        this.formularioEstabelecimento.controls.nome.setValue(estabelecimento.nome_estabelecimento)
        this.formularioEstabelecimento.controls.fantasia.setValue(estabelecimento.fantasia)
        this.formularioEstabelecimento.controls.documento.setValue(estabelecimento.documento)
        /* Dados Contato */
        this.formularioEstabelecimento.controls.telefone.setValue(estabelecimento.telefone)
        this.formularioEstabelecimento.controls.celular.setValue(estabelecimento.celular)
        this.formularioEstabelecimento.controls.email.setValue(estabelecimento.email)
        this.formularioEstabelecimento.controls.telefone_comercial.setValue(estabelecimento.telefone_comercial)
        /* Dados Endereço */
        this.formularioEstabelecimento.controls.cep.setValue(estabelecimento.cep)
        this.formularioEstabelecimento.controls.numero.setValue(estabelecimento.numero)
        this.formularioEstabelecimento.controls.complemento.setValue(estabelecimento.complemento)
        this.formularioEstabelecimento.controls.logradouro.setValue(estabelecimento.logradouro)
        this.formularioEstabelecimento.controls.bairro.setValue(estabelecimento.bairro)
        this.formularioEstabelecimento.controls.uf.setValue(estabelecimento.uf)
        this.formularioEstabelecimento.controls.cidade.setValue(estabelecimento.cidade)
        /* Dados Gateway */
        this.formularioEstabelecimento.controls.nome_gateway.setValue(estabelecimento.nome_gateway)
        this.formularioEstabelecimento.controls.marketplace_id.setValue(estabelecimento.marketplace_id)
        this.formularioEstabelecimento.controls.seller_id.setValue(estabelecimento.seller_id)
        this.formularioEstabelecimento.controls.valor_min_parcelas.setValue(estabelecimento.valor_min_parcelas)
        this.formularioEstabelecimento.controls.qtde_max_parcelas.setValue(estabelecimento.qtde_max_parcelas)

        if(estabelecimento.pagamento_cartao == true){
          this.permitirCartao = !this.permitirCartao;
        }

      }
    })
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => {
      sub.unsubscribe();
    })
  }

  fecharTelaCadastroEstabelecimento() {
    this.edicaoEstabelecimentoEvento.emit();
  }

  get f_estabelecimento() {
    return this.formularioEstabelecimento.controls;
  }

  editarEstabelecimento() {
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
/*     this.estabelecimentoService.criarSeller(dataSeller)
      .subscribe({
        next: res => {

        },
        error: e => {
          this.spinnerClose();
          this.loading = false;
          this.onAlert(e.error.message, 'danger')
        }
      }) */

    //requisição para editar o estabelecimento
    this.estabelecimentoService.editar(this.estabelecimento)
      .subscribe({
        next: value => {
          this.editarContato(this.contato, this.endereco, this.gateway)
        },
        error: e => {
          this.spinnerClose();
          this.loading = false;
          this.onAlert(e.error.info, 'danger')
          return;
        }
      })
  }

  editarContato(contato: IContato, endereco: IEndereco, gateway: IGateway) {

    this.dadosService.editarContato(contato)
      .subscribe({
        next: value => {
          this.editarEndereco(endereco, gateway)
        },
        error: e => {
          this.loading = false;
          this.onAlert(e.error.info, 'danger')
          return;
        }
      })

  }

  editarEndereco(endereco: IEndereco, gateway: IGateway) {

    this.dadosService.editarEndereco(endereco)
      .subscribe({
        next: value => {
          this.editarGateway(gateway)
        },
        error: e => {
          this.loading = false;
          this.onAlert(e.error.info, 'danger')
          return;
        }
      })
  }

  editarGateway(gateway: IGateway) {

    this.estabelecimentoService.editarGateway(gateway)
      .subscribe({
        next: value => {
          this.onAlert('Edilçao realizada com sucesso.', 'primary')
          this.submitted = false;
          this.formularioEstabelecimento.reset()
          this.estabelecimentoService.mostrarEdicaoEstabelecimento.next(false);
        },
        error: e => {
          this.loading = false;
          this.onAlert(e.error.info, 'danger')
          return;
        }
      })
  }

  vincularGatewayAoEstabelecimento(id_gateway) {
    this.estabelecimentoService.setGateway(this.idEntidadeParaCadastroDeDados, id_gateway)
      .subscribe({
        next: value => {

        },
        error: e => {
          console.log(e)
        }
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
          this.clienteService.bairro.next(endereco.bairro)
          this.clienteService.cidade.next(endereco.localidade)
          this.clienteService.logradouro.next(endereco.logradouro)
          this.clienteService.uf.next(endereco.uf)
          this.onAlert('Dados de endereço encontrados com sucesso.', 'primary')
        },
        error: e => {
          this.onAlert('Falha ao pesquisar CEP, tente novamente.', 'danger')
          console.log(e)
        }
      })
  }

  consultaCnpj() {
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
          this.formularioEstabelecimento.controls.cep.setValue(empresa.cep)
          this.formularioEstabelecimento.controls.bairro.setValue(empresa.bairro)
          this.formularioEstabelecimento.controls.cidade.setValue(empresa.municipio)
          this.formularioEstabelecimento.controls.logradouro.setValue(empresa.logradouro)
          this.formularioEstabelecimento.controls.uf.setValue(empresa.uf)
        },
        error: error => console.log(error)
      })
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
