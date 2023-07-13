import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICobranca } from '@core/types/ICobranca';
import { NgbModal, ModalDismissReasons, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { App } from 'app/app';
import { CobrancaService } from 'app/entities-modules/cobranca/cobranca.service';
import { EstabelecimentoService } from 'app/entities-modules/estabelecimento/cadastro-estabelecimento/estabelecimento.service';
import { ConfigInicialComponent } from '../config-inicial/config-inicial.component';
import { SpinnerComponent } from '../spinner/spinner.component';
import { VisualizacaoCobrancaComponent } from '../visualizacao-cobranca/visualizacao-cobranca.component';

@Component({
  selector: 'app-table-cobranca',
  templateUrl: './table-cobranca.component.html',
  styleUrls: ['./table-cobranca.component.scss']
})
export class TableCobrancaComponent implements OnInit {

  dadosCobranca: ICobranca[] = [];
  closeResult = '';

  constructor(
    private modalService: NgbModal,
    private cobrancaService: CobrancaService,
    private estabelecimentoService: EstabelecimentoService,
    private router: Router,
    config: NgbModalConfig
  ) { 
    config.backdrop = 'static';
		config.keyboard = false;
  }

  ngOnInit(): void {
    if(
      App.Instance.userInfo.estabelecimento_selecionado == null ||
      App.Instance.userInfo.estabelecimento_selecionado == undefined ||
      !App.Instance.userInfo.estabelecimento_selecionado
    ){
      this.openConfigInicial();
    }else{
      this.spinnerOpen();
      this.cobrancaService.getCobrancas()
        .subscribe({
          next: cobs => {
            this.dadosCobranca = cobs;
            this.spinnerClose();
          },
          error: e => {
            console.log(e)
          }
        })
    }
  }

  open(cobranca) {
    this.cobrancaService.cobrancaVisualizar.next(cobranca)
    this.modalService.open(
      VisualizacaoCobrancaComponent,
      {
        ariaLabelledBy: 'modal-basic-title',
        centered: true
      }).result.then(
        (result) => {
          
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        },
      );
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
