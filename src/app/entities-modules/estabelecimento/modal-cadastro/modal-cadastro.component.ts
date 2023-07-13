import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { App } from 'app/app';
import { UserService } from 'app/auth/service';
import { ModalSelectComponent } from 'app/components/modal-select/modal-select.component';
import { TablePrincipalComponent } from 'app/components/table-principal/table-principal.component';
import { ButtonAlertService } from 'app/layout/components/button-alert/button-alert.service';
import { EstabelecimentoService } from '../cadastro-estabelecimento/estabelecimento.service';

@Component({
  selector: 'app-modal-cadastro',
  templateUrl: './modal-cadastro.component.html',
  styleUrls: ['./modal-cadastro.component.scss']
})
export class ModalCadastroComponent implements OnInit {

  @ViewChild(ModalSelectComponent, {static: true})
  modalSelectComponent: ModalSelectComponent;

  @ViewChild(TablePrincipalComponent, {static: true})
  tablePrincipalComponent: TablePrincipalComponent;

  public submitted = false;
  public loading = false;

  public fieldAlert: boolean = false;
  public message: string = ''
  public status: string = ''

  cadastroEstabelecimento = new FormGroup({
    nome: new FormControl('', Validators.required),
    documento: new FormControl('', Validators.required),
  })

  constructor(
    private activeModal: NgbActiveModal,
    private estabelecimentoService: EstabelecimentoService,
    private buttonAlertService: ButtonAlertService,
    private _userService: UserService
    ) { }

  ngOnInit(): void {
  }

  dismissModal() {
    this.activeModal.dismiss();
  }

  closeModal(){
    this.activeModal.close();
  }

  cadastrar() {

    this.submitted = true;

    if (this.cadastroEstabelecimento.invalid) {
      return;
    }

    this.loading = true;

    this.estabelecimentoService.cadastrar(this.cadastroEstabelecimento.value)
      .subscribe({
        next: value => {
          this.onAlert(value.info, 'primary')
          this.closeModal();
          if(this.modalSelectComponent) this.modalSelectComponent.inicializar();
          if(this.tablePrincipalComponent) this.tablePrincipalComponent.inicializar();
        },
        error: e => {
          this.loading = false;
          this.onAlert(e.error.info, 'danger')
        }
      })

  }

  onAlert(info: string, status: string){
    this.buttonAlertService.fieldAlert.next(true)
    this.buttonAlertService.status.next(status)
    this.buttonAlertService.message.next(info)
    setTimeout(() => {
      this.buttonAlertService.fieldAlert.next(false)
    }, 3000)
  }

  get f() {
    return this.cadastroEstabelecimento.controls;
  }

}
