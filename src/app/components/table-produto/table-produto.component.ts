import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IProduto } from '@core/types/IProduto';
import { App } from 'app/app';
import { EstabelecimentoService } from 'app/entities-modules/estabelecimento/cadastro-estabelecimento/estabelecimento.service';
import { ProdutoService } from 'app/entities-modules/produto/produto.service';
import { ConfigInicialComponent } from '../config-inicial/config-inicial.component';
import { NgbModal, ModalDismissReasons, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ButtonAlertService } from 'app/layout/components/button-alert/button-alert.service';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-table-produto',
  templateUrl: './table-produto.component.html',
  styleUrls: ['./table-produto.component.scss']
})
export class TableProdutoComponent implements OnInit {

  dadosProduto: IProduto[] = [];
  closeResult = '';
  nomeEntidadeExclusao: string;

  constructor(
    private produtoService: ProdutoService,
    private estabelecimentoService: EstabelecimentoService,
    private router: Router,
    private buttonAlertService: ButtonAlertService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {

    if (
      App.Instance.userInfo.estabelecimento_selecionado == null ||
      App.Instance.userInfo.estabelecimento_selecionado == undefined ||
      !App.Instance.userInfo.estabelecimento_selecionado
    ) {
      this.openConfigInicial();
    } else {
      this.listarProdutos();
    }
  }

  listarProdutos(){
    this.produtoService.getProdutos()
    .subscribe({
      next: produtos => {
        this.dadosProduto = produtos
      },
      error: e => console.log(e)
    })
  }

  mostrarTelaEditar(produto: IProduto) {
    this.produtoService.dadosProdutoParaEditar.next(produto);
    this.produtoService.idProdutoParaEditar = produto.id;
    this.produtoService.mostrarTelaEditarProduto.next(true);
  }

  verificarProdutoPlano(modal, produto: IProduto){
    this.nomeEntidadeExclusao = produto.descricao;
    this.spinnerOpen();
    this.produtoService.idProdutoParaDeletar = produto.id;
    this.produtoService.verificarProdutoPlano().subscribe({
      next: v => {
        if(v){
          this.spinnerClose();
          this.onAlert('Esse produto não pode ser removido pois pertence a um plano.', 'danger')
        }else{
          this.spinnerClose();
          this.modalService.open(modal, {
            centered: true,
            windowClass: 'modal modal-danger',
            size: 'sm'
          })
        }
      },
      error: e => console.log(e)
    })
  }

  desativarProduto(){
    this.spinnerOpen();
    this.produtoService.deletar().subscribe({
      next: value => {
        this.spinnerClose();
        this.modalService.dismissAll();
        this.onAlert(value.info, 'primary')
        this.listarProdutos();
      },
      error: e => {
        this.spinnerClose();
        this.onAlert(e.error.info, 'danger')
      }
    })
  }

  fecharTelaEditar() {
    this.produtoService.mostrarTelaEditarProduto.next(false);
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

  onAlert(info: string, status: string) {
    this.buttonAlertService.fieldAlert.next(true)
    this.buttonAlertService.status.next(status)
    this.buttonAlertService.message.next(info)
    setTimeout(() => {
      this.buttonAlertService.fieldAlert.next(false)
    }, 5000)
  }

  spinnerOpen() {
    this.modalService.open(
      SpinnerComponent, {
      centered: true,
      size: 'xs'
    }).result.then(
      (result) => {

      },
      (reason) => {

      }
    )
  }

  spinnerClose() {
    this.modalService.dismissAll();
  }

}
