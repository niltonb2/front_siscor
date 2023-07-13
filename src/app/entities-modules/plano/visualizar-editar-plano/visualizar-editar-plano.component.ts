import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { App } from 'app/app';
import { SpinnerComponent } from 'app/components/spinner/spinner.component';
import { ProdutoService } from 'app/entities-modules/produto/produto.service';
import { ButtonAlertService } from 'app/layout/components/button-alert/button-alert.service';
import { Subscription } from 'rxjs';
import { PlanoService } from '../plano.service';

@Component({
  selector: 'app-visualizar-editar-plano',
  templateUrl: './visualizar-editar-plano.component.html',
  styleUrls: ['./visualizar-editar-plano.component.scss']
})
export class VisualizarEditarPlanoComponent implements OnInit, OnDestroy {

  @Output() edicaoPlanoEvento = new EventEmitter<any>();
  public submitted = false;
  public calculoAutomatico: boolean = false;
  public valorPlano = 0;
  public idProdutos: number[];

  public customTag: any[] = [];
  public customTagselected;
  subs: Subscription[] = [];

  formularioPlano = new FormGroup({
    tipo: new FormControl(1, Validators.required),
    descricao: new FormControl('', Validators.required),
    valor: new FormControl('', Validators.required),
    produtos: new FormControl([], Validators.required)
  })

  constructor(
    private produtoService: ProdutoService,
    private planoService: PlanoService,
    private modalService: NgbModal,
    private buttonAlertService: ButtonAlertService
  ) { }

  ngOnInit(): void {
    this.planoService.dadosPlanoParaEditar.subscribe({
      next: plano => {
        this.idProdutos = plano.informacoes.produto;
        this.formularioPlano.controls.tipo.setValue(plano.tipo);
        this.formularioPlano.controls.descricao.setValue(plano.descricao);
        this.formularioPlano.controls.valor.setValue(plano.valor);
      },
      error: e => console.log(e)
    })

    const sub1 = this.produtoService.listaProdutosSelectPlano.subscribe({
      next: produtos => {
        let produtosQuePertencemAoPlano = [];
        produtos.forEach((produto) => {
          if(this.idProdutos.includes(produto.id)){
            produtosQuePertencemAoPlano.push({ id: produto.id, name: produto.descricao, valor: produto.valor })
          }
          this.customTag.push({ id: produto.id, name: produto.descricao, valor: produto.valor });
        });

        this.formularioPlano.controls.produtos.setValue(produtosQuePertencemAoPlano);
      },
      error: e => console.log(e)
    })

    this.subs.push(sub1);
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
    this.planoService.mostrarTelaPlanoEditar.next(false);
  }

    /**
  * Select Custom Tag
  *
  * @param name
  */
     selectAddTagMethod(name) {
      return { name: name, tag: true };
    }

  get f_plano() {
    return this.formularioPlano.controls;
  }

  fecharTelaEdicaoPlano(){
    this.edicaoPlanoEvento.emit();
  }

  onCheck() {
    if (this.formularioPlano.controls.valor.status == 'DISABLED') {
      this.formularioPlano.controls.valor.setValue(this.valorPlano)
      this.calculoAutomatico = !this.calculoAutomatico;
      this.formularioPlano.controls.valor.enable();
    } else {
      this.formularioPlano.controls.valor.setValue(this.valorPlano)
      this.calculoAutomatico = !this.calculoAutomatico;
      this.formularioPlano.controls.valor.disable();
    }
  }

  editarPlano(){
    this.submitted = true;

    if (this.formularioPlano.invalid) {
      return;
    }

    this.spinnerOpen();

    let produtos: any[] = [];

    this.valorPlano = 0;

    this.formularioPlano.value.produtos.forEach(produto => {
      this.valorPlano += produto.valor;
      produtos.push(produto.id);
    })

    const bodyPlano = {
      "tipo": this.formularioPlano.value.tipo,
      "descricao": this.formularioPlano.value.descricao,
      "valor": this.valorPlano,
      "informacoes": {
        "produto": produtos
      }
    }

    this.planoService.editar(bodyPlano)
    .subscribe({
      next: plano => {
        this.onAlert('Cadastro alterado com sucesso.', 'primary');
        this.submitted = false;
        this.spinnerClose();
        this.planoService.mostrarTelaPlanoEditar.next(false);
      },
      error: e => {
        this.onAlert('Erro na alteração.', 'danger');
        this.submitted = false;
        this.spinnerClose();
      }
    })
  }

  atualizarValor(produtos){
    let valorCalculo = 0;
    produtos.forEach(prod => {
      valorCalculo += prod.valor;
    })

    this.valorPlano = valorCalculo;
    this.formularioPlano.controls.valor.setValue(valorCalculo)

    if(this.calculoAutomatico){
    }
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
