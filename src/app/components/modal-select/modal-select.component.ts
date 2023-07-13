import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IUserEc } from '@core/types/IUserEc';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { App } from 'app/app';
import { UserService } from 'app/auth/service';
import { EstabelecimentoService } from 'app/entities-modules/estabelecimento/cadastro-estabelecimento/estabelecimento.service';
import { ClienteService } from 'app/entities-modules/pessoa/cadastro-cliente/cliente.service';
import { Subscription } from 'rxjs';
import { Token } from '../../Utils/token';
import { TablePrincipalComponent } from '../table-principal/table-principal.component';

@Component({
  selector: 'app-modal-select',
  templateUrl: './modal-select.component.html',
  styleUrls: ['./modal-select.component.scss']
})
export class ModalSelectComponent implements OnInit, OnDestroy {

  @ViewChild(TablePrincipalComponent, { static: true })
  tabelaPrincipalComponent: TablePrincipalComponent;

  public submitted = false;
  public loading = false;

  public fieldAlert: boolean = false;
  public message: string = ''
  public status: string = ''

  selectEC = new FormGroup({
    estabelecimento: new FormControl('', Validators.required)
  })

  subs: Subscription[] = [];
  estabelecimentosPorUsuario: IUserEc[] = [];
  estabelecimentoSelecionado: string = '';

  constructor(
    private _userService: UserService,
    private estabelecimentoService: EstabelecimentoService,
    private clienteService: ClienteService,
    private activeModal: NgbActiveModal
  ) { 

  }

  ngOnInit(): void {
    this.inicializar()
  }

  inicializar(){
    const sub1 = this._userService.getQtdeEcsByUser()
    .subscribe({
      next: ecs => {
        this.estabelecimentosPorUsuario = ecs
      },
      error: e => console.log(e)
    })

    this.subs.push(sub1)
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  dismissModal() {
    this.activeModal.dismiss();
  }

  closeModal(){
    this.activeModal.close();
  }

  get f() {
    return this.selectEC.controls;
  }

  selecionar(){
    this.submitted = true;

    if (this.selectEC.invalid) {
      return;
    }

    const [ id, nome ] = this.selectEC.value.estabelecimento.split('_')
    this.estabelecimentoService.estabelecimentoSelecionado.next(nome)
    this.clienteService.idEstabelecimento = id;
    this._userService.selecionarEstabelecimento(App.Instance.userInfo.id, id)
      .subscribe({
        next: v => {
          window.location.reload();
        },
        error: e => console.log(e)
      })
    this.dismissModal();
  }

}
