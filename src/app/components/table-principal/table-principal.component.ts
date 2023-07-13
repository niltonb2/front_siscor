import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IContato } from '@core/types/IContato';
import { IEndereco } from '@core/types/IEndereco';
import { NgbModal, ModalDismissReasons, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { App } from 'app/app';
import { DadosService } from 'app/entities-modules/dados/dados.service';
import { EstabelecimentoService } from 'app/entities-modules/estabelecimento/cadastro-estabelecimento/estabelecimento.service';
import { ClienteService } from 'app/entities-modules/pessoa/cadastro-cliente/cliente.service';
import { ButtonAlertService } from 'app/layout/components/button-alert/button-alert.service';
import { PortalClienteService } from 'app/main/portal/portal-cliente.service';
import { Token } from 'app/Utils/token';
import { ConfigInicialComponent } from '../config-inicial/config-inicial.component';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-table-principal',
  templateUrl: './table-principal.component.html',
  styleUrls: ['./table-principal.component.scss']
})
export class TablePrincipalComponent implements OnInit {

  closeResult = '';

  contatoEmBranco: IContato = {
    id: 0,
    telefone: '',
    celular: '',
    telefone_comercial: '',
    email: '',
    created_at: '',
    updated_at: '',
    deleted_at: '',
    deleted: false
  }

  enderecoEmBranco: IEndereco = {
    id: 0,
    tipo_endereco: '',
    cep: '',
    cidade: '',
    uf: '',
    logradouro: '',
    numero: '',
    bairro: '',
    complemento: '',
    created_at: '',
    updated_at: '',
    deleted_at: '',
    deleted: false
  }

  public progressbarHeight = '.857rem';
  public valorProgresso = 0;

  public fieldAlert: boolean = false;
  public message: string = '';
  public status: string = '';
  public loading = false;

  idEntidadeExclusao: number;
  nomeEntidadeExclusao: string;

  dadosEcsOuClientes = [];

  constructor(
    private buttonAlertService: ButtonAlertService,
    private clienteService: ClienteService,
    private estabelecimentoService: EstabelecimentoService,
    private modalService: NgbModal,
    private dadosService: DadosService,
    private router: Router,
    private portalClienteService: PortalClienteService,
    config: NgbModalConfig
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    this.inicializar();
  }

  ngOnInit(): void {
  }

  inicializar() {
    if(
      App.Instance.userInfo.estabelecimento_selecionado == null ||
      App.Instance.userInfo.estabelecimento_selecionado == undefined ||
      !App.Instance.userInfo.estabelecimento_selecionado
    ){
      this.open();
    }else{
      this.spinnerOpen();
      if (this.router.url == '/cliente') {
        const estabelecimento = App.Instance.userInfo.estabelecimento_selecionado ? App.Instance.userInfo.estabelecimento_selecionado : Token.get('estabelecimento')
        if (estabelecimento) {
          this.clienteService.buscar(estabelecimento)
            .subscribe({
              next: array => {
                this.dadosEcsOuClientes = array;
                this.spinnerClose();
              },
              error: e => console.log(e)
            })
        }
  
      } else {
        this.estabelecimentoService.buscar()
          .subscribe({
            next: array => {
              array.forEach(ec => {
                if(!ec.gateway) this.estabelecimentoService.gatewayConfigurado.next(false);
              })
              this.dadosEcsOuClientes = array
              this.spinnerClose();
            },
            error: e => console.log(e)
          })
      }
    }
  }

  abrirTelaVisualizacao(linha) {
    if (this.router.url == '/cliente') {
      this.clienteService.buscarCadastroCompleto(linha.id)
        .subscribe({
          next: pessoa => {
            this.clienteService.clienteParaEditar.next(pessoa[0])
            this.clienteService.mostrarEdicaoCliente.next(true)
            this.clienteService.idClienteEditar = linha.id
            this.dadosService.idContatoEditar = linha.contato
            this.dadosService.idEnderecoEditar = linha.endereco
          },
          error: e => {
            console.log(e)
          }
        })
    } else {
      this.estabelecimentoService.buscarEstabelecimentoDadosCompletos(linha.id)
        .subscribe({
          next: ec => {
            this.estabelecimentoService.estabelecimentoParaEditar.next(ec[0])
            this.estabelecimentoService.mostrarEdicaoEstabelecimento.next(true)
            this.estabelecimentoService.idEstabelecimentoParaEditar = linha.id
            this.dadosService.idContatoEditar = linha.contato
            this.dadosService.idEnderecoEditar = linha.endereco
            this.estabelecimentoService.idGatewayEditar = linha.gateway
          },
          error: e => {
            console.log(e)
          }
        })
    }

  }

  fecharTelaVisualizacao() {
    this.clienteService.mostrarEdicaoCliente.next(true)
  }

  abrirModalDelete(modalPrimary, id: number, nome: string, documento: string) {

    this.portalClienteService.buscarCobrancaPorDocumento(documento)
    .subscribe({
        next: pessoa => {
            if(pessoa.length == 0){
              this.idEntidadeExclusao = id;
              this.nomeEntidadeExclusao = nome;
              this.modalService.open(modalPrimary, {
                centered: true,
                windowClass: 'modal modal-danger',
                size: 'sm'
              });
            }else{
              this.onAlert('Esse cliente não pode ser removido pois já possui cobranças geradas.', 'danger')
            }
        }
    })
  }

  deletarEntidade() {
    this.loading = true;
    if (this.router.url == '/cliente') {

      this.clienteService.deletar(this.idEntidadeExclusao)
        .subscribe({
          next: value => {
            this.listarClientes();
            this.modalService.dismissAll();
            this.onAlert(value.info, 'primary')
          },
          error: e => {
            this.onAlert(e.error.info, 'danger')
            this.loading = false;
          }
        })
    } else {
      this.estabelecimentoService.deletar(this.idEntidadeExclusao)
        .subscribe({
          next: value => {
            this.listarEstabelecimentos();
            this.modalService.dismissAll();
            this.onAlert(value.info, 'primary')
          },
          error: e => {
            this.onAlert(e.error.info, 'danger')
            this.loading = false;
          }
        })
    }
  }

  listarClientes() {
    const estabelecimento = App.Instance.userInfo.estabelecimento_selecionado ? App.Instance.userInfo.estabelecimento_selecionado : Token.get('estabelecimento')
    if (estabelecimento) {
      this.clienteService.buscar(estabelecimento)
        .subscribe({
          next: array => {
            this.dadosEcsOuClientes = array;
            this.spinnerClose();
          },
          error: e => console.log(e)
        })
    }
  }

  listarEstabelecimentos() {
    this.estabelecimentoService.buscar()
      .subscribe({
        next: array => {
          this.dadosEcsOuClientes = array
          this.spinnerClose();
        },
        error: e => console.log(e)
      })
  }

  onAlert(info: string, status: string) {
    this.buttonAlertService.fieldAlert.next(true)
    this.buttonAlertService.status.next(status)
    this.buttonAlertService.message.next(info)
    setTimeout(() => {
      this.buttonAlertService.fieldAlert.next(false)
    }, 5000)
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

  open() {
    this.modalService.open(
      ConfigInicialComponent,
      {
        ariaLabelledBy: 'modal-basic-title',
        centered: true
      }).result.then(
        (result) => {
          this.estabelecimentoService.mostrarCadastroEstabelecimento.next(true);
          this.router.navigate(['/estabelecimento']);
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

  

}