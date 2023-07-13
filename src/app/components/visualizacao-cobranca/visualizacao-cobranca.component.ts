import { Component, OnDestroy, OnInit } from '@angular/core';
import { ICobranca } from '@core/types/ICobranca';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CobrancaService } from 'app/entities-modules/cobranca/cobranca.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-visualizacao-cobranca',
  templateUrl: './visualizacao-cobranca.component.html',
  styleUrls: ['./visualizacao-cobranca.component.scss']
})
export class VisualizacaoCobrancaComponent implements OnInit, OnDestroy {

  dadosDaCobranca: ICobranca;
  subs: Subscription[] = [];

  constructor(
    private activeModal: NgbActiveModal,
    private cobrancaService: CobrancaService
  ) { }

  ngOnInit(): void {
    const sub = this.cobrancaService.cobrancaVisualizar.subscribe({next: v => this.dadosDaCobranca = v})
    this.subs.push(sub);
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

}
