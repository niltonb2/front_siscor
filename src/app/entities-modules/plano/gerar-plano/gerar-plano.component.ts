import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { App } from 'app/app';
import { SpinnerComponent } from 'app/components/spinner/spinner.component';
import { ProdutoService } from 'app/entities-modules/produto/produto.service';
import { ButtonAlertService } from 'app/layout/components/button-alert/button-alert.service';
import { Token } from 'app/Utils/token';
import { Subscription } from 'rxjs';
import { PlanoService } from '../plano.service';

@Component({
  selector: 'app-gerar-plano',
  templateUrl: './gerar-plano.component.html',
  styleUrls: ['./gerar-plano.component.scss']
})
export class GerarPlanoComponent implements OnInit, OnDestroy {

  public submitted = false;
  public calculoAutomatico: boolean = false;
  public valorPlano = 0;

  @Output() gerarPlanoEvento = new EventEmitter<any>();

  formularioPlano = new FormGroup({
    tipo: new FormControl(1, Validators.required),
    descricao: new FormControl('', Validators.required),
    valor: new FormControl('', Validators.required),
    produtos: new FormControl([], Validators.required)
  })

  public customTag: any[] = [];
  public customTagselected;
  subs: Subscription[] = [];

  constructor(
    private produtoService: ProdutoService,
    private planoService: PlanoService,
    private buttonAlertService: ButtonAlertService,
    private modalService: NgbModal
  ) { }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
    this.planoService.mostrarTelaPlano.next(false);
  }

  ngOnInit(): void {

    const sub1 = this.produtoService.listaProdutosSelectPlano.subscribe({
      next: produtos => {
        produtos.forEach((produto) => {
          this.customTag.push({ id: produto.id, name: produto.descricao, valor: produto.valor });
        });
      },
      error: e => console.log(e)
    })

    this.subs.push(sub1);
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

  cadastrarPlano(){

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

    let valorDoPlanoParaCadastro = this.formularioPlano.value.tipo == 'mensal' ? this.valorPlano : this.formularioPlano.value.valor;

    const bodyPlano = {
      "tipo": this.formularioPlano.value.tipo,
      "descricao": this.formularioPlano.value.descricao,
      "valor": valorDoPlanoParaCadastro,
      "estabelecimento": App.Instance.userInfo.estabelecimento_selecionado ? App.Instance.userInfo.estabelecimento_selecionado : Token.get('estabelecimento'),
      "informacoes": {
        "produto": produtos
      }
    }
    
    this.planoService.cadastrar(bodyPlano)
      .subscribe({
        next: plano => {
          this.onAlert('Cadastro realizado com sucesso.', 'primary');
          this.submitted = false;
          this.spinnerClose();
          this.planoService.mostrarTelaPlano.next(false);
        },
        error: e => {
          this.onAlert('Erro no cadastro.', 'primary');
          this.submitted = false;
          this.spinnerClose();
        }
      })
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

  eventoGerarPlano() {
    this.gerarPlanoEvento.emit();
  }

  onAlert(info: string, status: string) {
    this.buttonAlertService.fieldAlert.next(true)
    this.buttonAlertService.status.next(status)
    this.buttonAlertService.message.next(info)
    setTimeout(() => {
      this.buttonAlertService.fieldAlert.next(false)
    }, 3000)
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
