import { Component, OnDestroy, OnInit } from '@angular/core';
import { IProduto } from '@core/types/IProduto';
import { ProdutoService } from 'app/entities-modules/produto/produto.service';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-infos-plano',
  templateUrl: './modal-infos-plano.component.html',
  styleUrls: ['./modal-infos-plano.component.scss']
})
export class ModalInfosPlanoComponent implements OnInit, OnDestroy {

  dadosProdutos: IProduto[];
  subs: Subscription[] = [];

  constructor(
    private produtoService: ProdutoService,
    private activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    const sub1 = this.produtoService.listaProdutosSelectPlano.subscribe({next: produtos => this.dadosProdutos = produtos})
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

}
