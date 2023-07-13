import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { CardPrincipalComponent } from 'app/components/card-principal/card-principal.component';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ModalCadastroComponent } from './modal-cadastro/modal-cadastro.component';
import { ClienteService } from '../pessoa/cadastro-cliente/cliente.service';
import { EstabelecimentoService } from './cadastro-estabelecimento/estabelecimento.service';

@Component({
  selector: 'app-estabelecimento',
  templateUrl: './estabelecimento.component.html',
  styleUrls: ['./estabelecimento.component.scss']
})
export class EstabelecimentoComponent implements OnInit, OnDestroy {

  @ViewChild('cardPrincipal', { static: true })
  cardPrincipalComponent: CardPrincipalComponent;

  subs: Subscription[] = [];

  closeResult = '';

  cadastro: boolean = false;
  editar: boolean = false;
  gatewayAtivo: boolean;

  constructor(
    private modalService: NgbModal,
    private estabelecimentoService: EstabelecimentoService
  ) { }

  ngOnInit(): void {
    const sub1 = this.estabelecimentoService.mostrarCadastroEstabelecimento.subscribe({next: value => this.cadastro = value})
    const sub2 = this.estabelecimentoService.mostrarEdicaoEstabelecimento.subscribe({next: value => this.editar = value})
    const sub3 = this.estabelecimentoService.gatewayConfigurado.subscribe({next: value => this.gatewayAtivo = value})
    this.subs.push(sub1, sub2, sub3)
  }

  inicializar() {
    if (this.cardPrincipalComponent) this.cardPrincipalComponent.inicializar();
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
    this.estabelecimentoService.mostrarCadastroEstabelecimento.next(false);
  }

  mostrarTelaCadastro(){
    this.estabelecimentoService.mostrarCadastroEstabelecimento.next(true)
  }

  fecharTelaCadastro(){
    this.estabelecimentoService.mostrarCadastroEstabelecimento.next(false);
    if(!this.gatewayAtivo) window.location.reload();
  }

  fecharTelaEdicao(){
    this.estabelecimentoService.mostrarEdicaoEstabelecimento.next(false)
  }

  open() {
    this.modalService.open(
      ModalCadastroComponent,
      { 
        ariaLabelledBy: 'modal-basic-title',
        centered: true
      }).result.then(
        (result) => {
          this.inicializar();
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
