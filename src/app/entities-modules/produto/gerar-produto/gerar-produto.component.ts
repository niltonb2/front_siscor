import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerComponent } from 'app/components/spinner/spinner.component';
import { ButtonAlertService } from 'app/layout/components/button-alert/button-alert.service';
import { ProdutoService } from '../produto.service';

@Component({
  selector: 'app-gerar-produto',
  templateUrl: './gerar-produto.component.html',
  styleUrls: ['./gerar-produto.component.scss']
})
export class GerarProdutoComponent implements OnInit, OnDestroy {

  @Output() gerarProdutoEvento = new EventEmitter<any>();
  public submitted = false;
  public salvarMaisNovoCadastro: boolean = false;

  formularioProduto = new FormGroup({
    tipo: new FormControl(1, Validators.required),
    descricao: new FormControl('', Validators.required),
    valor: new FormControl('', Validators.required)
  })

  constructor(
    private modalService: NgbModal,
    private buttonAlertService: ButtonAlertService,
    private produtoService: ProdutoService
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.produtoService.mostrarTelaProduto.next(false);
  }

  get f_produto() {
    return this.formularioProduto.controls;
  }

  eventoGerarProduto() {
    this.gerarProdutoEvento.emit();
  }

  cadastrarProduto(){
    this.submitted = true;

    if (this.formularioProduto.invalid) {
      return;
    }

    this.spinnerOpen();

    this.produtoService.cadastrar(this.formularioProduto.value)
      .subscribe({
        next: v => {
          this.onAlert('Cadastro realizado com sucesso.', 'primary');
          this.submitted = false;
          if(this.salvarMaisNovoCadastro){
            this.formularioProduto.reset();
            this.formularioProduto.controls.tipo.setValue(1);
            this.informarNovoCadastro();
            this.spinnerClose();
          }else{
            this.spinnerClose();
            this.produtoService.mostrarTelaProduto.next(false);
          }
        }
      })
  }

  informarNovoCadastro(){
    this.salvarMaisNovoCadastro = !this.salvarMaisNovoCadastro
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
