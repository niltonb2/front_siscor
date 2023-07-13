import { Component, OnInit } from '@angular/core';
import { IPlano } from '@core/types/IPlano';
import { IProduto } from '@core/types/IProduto';
import { PlanoService } from 'app/entities-modules/plano/plano.service';
import { ProdutoService } from 'app/entities-modules/produto/produto.service';
import { ModalInfosPlanoComponent } from '../modal-infos-plano/modal-infos-plano.component';
import { NgbModal, ModalDismissReasons, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { App } from 'app/app';
import { ConfigInicialComponent } from '../config-inicial/config-inicial.component';
import { EstabelecimentoService } from 'app/entities-modules/estabelecimento/cadastro-estabelecimento/estabelecimento.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table-plano',
  templateUrl: './table-plano.component.html',
  styleUrls: ['./table-plano.component.scss']
})
export class TablePlanoComponent implements OnInit {

  dadosPlano: IPlano[] = [];
  produtosPlano: IProduto[] = [];
  closeResult = '';

  constructor(
    private produtoService: ProdutoService,
    private planoService: PlanoService,
    private modalService: NgbModal,
    private estabelecimentoService: EstabelecimentoService,
    private router: Router
  ) { }

  ngOnInit(): void {

    if (
      App.Instance.userInfo.estabelecimento_selecionado == null ||
      App.Instance.userInfo.estabelecimento_selecionado == undefined ||
      !App.Instance.userInfo.estabelecimento_selecionado
    ) {
      this.openConfigInicial();
    } else {
      this.planoService.getPlanos()
        .subscribe({
          next: planos => {
            this.dadosPlano = planos
          },
          error: e => console.log(e)
        })

      this.produtoService.getProdutos()
        .subscribe({
          next: produtos => {
            this.produtoService.listaProdutosSelectPlano.next(produtos);
          },
          error: e => console.log(e)
        })
    }
  }

  visualizarInfos(plano) {
    let produtos: IProduto[] = [];
    plano.informacoes.produto.forEach(idProduto => {
      this.produtoService.getProdutoById(idProduto)
        .subscribe({
          next: produto => produtos.push(produto[0]),
          error: e => console.log(e)
        })
    })

    this.produtoService.listaProdutosSelectPlano.next(produtos);

    this.modalService.open(
      ModalInfosPlanoComponent,
      {
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
        size: 'lg'
      }).result.then(
        (result) => {

        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        },
      );
  }

  mostrarTelaEditar(plano: IPlano){
    this.planoService.dadosPlanoParaEditar.next(plano);
    this.planoService.mostrarTelaPlanoEditar.next(true);
    this.planoService.idPlanoParaEditar = plano.id;
  }

  openConfigInicial() {
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
