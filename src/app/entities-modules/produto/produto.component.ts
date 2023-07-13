import { Component, OnDestroy, OnInit } from '@angular/core';
import { ButtonAlertService } from 'app/layout/components/button-alert/button-alert.service';
import { Subscription } from 'rxjs';
import { ProdutoService } from './produto.service';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.scss']
})
export class ProdutoComponent implements OnInit, OnDestroy {

  cadastroProduto: boolean = false;
  edicaoProduto: boolean = false;
  subs: Subscription[] = [];

  constructor(
    private buttonAlertService: ButtonAlertService,
    private produtoService: ProdutoService
  ) { }

  ngOnInit(): void {
    const sub1 = this.produtoService.mostrarTelaProduto.subscribe({next: v => this.cadastroProduto = v})
    const sub2 = this.produtoService.mostrarTelaEditarProduto.subscribe({next: v => this.edicaoProduto = v})
    this.subs.push(sub1, sub2)
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  mostrarTelaCadastro() {
    this.produtoService.mostrarTelaProduto.next(true);
  }

  fecharTelaCadastro() {
    this.produtoService.mostrarTelaProduto.next(false);
  }

  fecharTelaEdicao(){
    this.produtoService.mostrarTelaEditarProduto.next(false);
  }

  onAlert(info: string, status: string) {
    this.buttonAlertService.fieldAlert.next(true)
    this.buttonAlertService.status.next(status)
    this.buttonAlertService.message.next(info)
    setTimeout(() => {
      this.buttonAlertService.fieldAlert.next(false)
    }, 4000)
  }

}