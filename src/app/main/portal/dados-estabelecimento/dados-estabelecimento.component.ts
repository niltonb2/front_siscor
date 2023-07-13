import { Component, OnDestroy, OnInit } from '@angular/core';
import { ICobranca } from '@core/types/ICobranca';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { PortalClienteService } from '../portal-cliente.service';

@Component({
  selector: 'app-dados-estabelecimento',
  templateUrl: './dados-estabelecimento.component.html',
  styleUrls: ['./dados-estabelecimento.component.scss']
})
export class DadosEstabelecimentoComponent implements OnInit, OnDestroy {

  dadosDaCobranca: ICobranca;
  subs: Subscription[] = [];
  linkWhatsApp: string;

  constructor(
    private activeModal: NgbActiveModal,
    private portalClienteService: PortalClienteService
  ) { }

  ngOnInit(): void {
    const sub = this.portalClienteService.cobrancaParaPagamento.subscribe({next: cob => {
      this.linkWhatsApp = `https://api.whatsapp.com/send?phone=55${cob.celular}&text=Ol%C3%A1!`;
      this.dadosDaCobranca = cob
    }})
    this.subs.push(sub)
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

  wpp(){
    
  }

}
