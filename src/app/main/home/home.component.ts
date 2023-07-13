import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { App } from 'app/app';
import { UserService } from 'app/auth/service';
import { ConfigInicialComponent } from 'app/components/config-inicial/config-inicial.component';
import { EstabelecimentoService } from 'app/entities-modules/estabelecimento/cadastro-estabelecimento/estabelecimento.service';
import { ModalCadastroComponent } from 'app/entities-modules/estabelecimento/modal-cadastro/modal-cadastro.component';
import { Token } from 'app/Utils/token';
import { Subscription } from 'rxjs';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  closeResult = '';

  pago: number;
  emAberto: number;
  pendente: number;
  vencido: number;

  subs: Subscription[] = [];

  constructor(
    private estabelecimentoService: EstabelecimentoService,
    private _userService: UserService,
    private modalService: NgbModal,
    private router: Router,
    private dashboardService: DashboardService,
    config: NgbModalConfig
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    if(
      App.Instance.userInfo.estabelecimento_selecionado == null ||
      App.Instance.userInfo.estabelecimento_selecionado == undefined ||
      !App.Instance.userInfo.estabelecimento_selecionado
      ){
        const token = Token.get('token');

        if (!token) {
          this.authRecused();
          return;
        }

        this._userService.getDadosUser(token)
        .subscribe({
          next: usuario => {
            if(
              !usuario.estabelecimento_selecionado ||
              usuario.estabelecimento_selecionado == null ||
              usuario.estabelecimento_selecionado == undefined
            ){
              this.open();
              return;
            }
            Token.insert('estabelecimento', usuario.estabelecimento_selecionado)
            Token.insert('usuario', usuario.id)
            App.Instance.setUserInfo(usuario)
            this._userService.usuarioLogado.next(usuario)
            if(usuario.estabelecimento_selecionado) this.estabelecimentoService.buscarPorId(usuario.estabelecimento_selecionado)
            .subscribe({
              next: value => this.estabelecimentoService.estabelecimentoSelecionado.next(value[0].nome)
            })
          },
          error: e => console.log(e)
        })
    }else{
      this.inicializar();
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  authRecused() {
    Token.clearStorage();
    this.router.navigate(['/pages/authentication/login'])
    return false;
  }

  inicializar(){
    const sub = this.dashboardService.dadosCobrancaDashboard
    .subscribe({
      next: cobs => {
        if(cobs == null || cobs == undefined || !cobs){
          this.emAberto = 0
          this.pago = 0
          this.pendente = 0
          this.vencido = 0
        }else{
          this.emAberto = cobs.abertos.length
          this.pago = cobs.pagos.length
          this.pendente = cobs.pendentes.length
          this.vencido = cobs.vencidos.length
        }
      },
      error: e => console.log(e)
    })

    this.subs.push(sub);
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

  openModalCadastroEstabelecimento() {
    this.modalService.open(
      ModalCadastroComponent,
      {
        ariaLabelledBy: 'modal-basic-title',
        centered: true
      }).result.then(
        (result) => {
          this.modalService.dismissAll()
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
