import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { App } from 'app/app';
import { UserService } from 'app/auth/service';
import { CardPrincipalService } from 'app/components/card-principal/card-principal.service';
import { ConfigInicialComponent } from 'app/components/config-inicial/config-inicial.component';
import { Token } from 'app/Utils/token';
import { Subscription } from 'rxjs';
import { EstabelecimentoService } from '../estabelecimento/cadastro-estabelecimento/estabelecimento.service';
import { ClienteService } from './cadastro-cliente/cliente.service';

@Component({
  selector: 'app-pessoa',
  templateUrl: './pessoa.component.html',
  styleUrls: ['./pessoa.component.scss']
})
export class PessoaComponent implements OnInit, OnDestroy {

  closeResult = '';
  
  cadastro: boolean = false;
  editar: boolean = false;

  subs: Subscription[] = [];

  constructor(
    private _userService: UserService,
    private modalService: NgbModal,
    private cardPrincipalService: CardPrincipalService,
    private router: Router,
    private clienteService: ClienteService,
    private estabelecimentoService: EstabelecimentoService
  ) {
    const sub1 = this.clienteService.mostrarCadastroCliente.subscribe({next: value => this.cadastro = value})
    const sub2 = this.clienteService.mostrarEdicaoCliente.subscribe({next: value => this.editar = value})
    this.subs.push(sub1, sub2)
   }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.cardPrincipalService.mostrarTelaCadastro.next(false)
    this.subs.forEach(sub => sub.unsubscribe())
    this.fecharTelaCadastro();
  }

  modalOpenPrimary(modalPrimary) {
    this.modalService.open(modalPrimary, {
      centered: true,
      windowClass: 'modal modal-primary'
    });
  }

  mostrarTelaCadastro(){
    this.clienteService.mostrarCadastroCliente.next(true)
  }

  fecharTelaCadastro(){
    this.clienteService.mostrarCadastroCliente.next(false)
  }

  fecharTelaEdicao(){
    this.clienteService.mostrarEdicaoCliente.next(false)
  }

}
