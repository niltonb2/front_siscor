import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EstabelecimentoService } from 'app/entities-modules/estabelecimento/cadastro-estabelecimento/estabelecimento.service';

@Component({
  selector: 'app-config-inicial',
  templateUrl: './config-inicial.component.html',
  styleUrls: ['./config-inicial.component.scss']
})
export class ConfigInicialComponent implements OnInit {

  constructor(
    private activeModal: NgbActiveModal,
    private estabelecimentoService: EstabelecimentoService
  ) { }

  ngOnInit(): void {
  }

  dismissModal() {
    this.activeModal.dismiss();
  }

  closeModal(){
    this.estabelecimentoService.gatewayConfigurado.next(false);
    this.activeModal.close();
  }
}
