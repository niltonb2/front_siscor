import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SpinnerComponent } from 'app/components/spinner/spinner.component';
import { Subscription } from 'rxjs';
import { ProdutoService } from '../produto.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ButtonAlertService } from 'app/layout/components/button-alert/button-alert.service';

@Component({
  selector: 'app-visualizar-editar-produto',
  templateUrl: './visualizar-editar-produto.component.html',
  styleUrls: ['./visualizar-editar-produto.component.scss']
})
export class VisualizarEditarProdutoComponent implements OnInit, OnDestroy {

  @Output() edicaoProdutoEvento = new EventEmitter<any>();

  public submitted = false;
  subs: Subscription[] = [];

  formularioProduto = new FormGroup({
    tipo: new FormControl(1, Validators.required),
    descricao: new FormControl('', Validators.required),
    valor: new FormControl('', Validators.required)
  })

  constructor(
    private produtoService: ProdutoService,
    private buttonAlertService: ButtonAlertService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    const sub1 = this.produtoService.dadosProdutoParaEditar.subscribe({
      next: produto => {
        this.formularioProduto.controls.tipo.setValue(produto.tipo)
        this.formularioProduto.controls.descricao.setValue(produto.descricao)
        this.formularioProduto.controls.valor.setValue(produto.valor)
      },
      error: e => console.log(e)
    })

    this.subs.push(sub1);
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
    this.produtoService.mostrarTelaEditarProduto.next(false);
  }

  get f_produto() {
    return this.formularioProduto.controls;
  }

  editarProduto(){
    this.submitted = true;

    if (this.formularioProduto.invalid) {
      return;
    }

    this.spinnerOpen();

    this.produtoService.editar(this.formularioProduto.value)
      .subscribe({
        next: v => {
          this.onAlert('Cadastro alterado com sucesso.', 'primary')
          this.submitted = false;
          this.produtoService.mostrarTelaEditarProduto.next(false);
          this.spinnerClose();
        },
        error: e => {
          this.spinnerClose();
          this.onAlert(e.error.info, 'danger');
        }
      })
  }

  fecharTelaEdicaoProduto(){
    this.edicaoProdutoEvento.emit();
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

  onAlert(info: string, status: string) {
    this.buttonAlertService.fieldAlert.next(true)
    this.buttonAlertService.status.next(status)
    this.buttonAlertService.message.next(info)
    setTimeout(() => {
      this.buttonAlertService.fieldAlert.next(false)
    }, 3000)
  }

}
