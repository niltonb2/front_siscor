import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AssinaturaService } from 'app/entities-modules/assinatura/assinatura.service';
import { ButtonAlertService } from 'app/layout/components/button-alert/button-alert.service';
import { Subscription } from 'rxjs';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-resumo-assinatura',
  templateUrl: './resumo-assinatura.component.html',
  styleUrls: ['./resumo-assinatura.component.scss']
})
export class ResumoAssinaturaComponent implements OnInit, OnDestroy {

  dadosAssinaturaParaGerar;
  resumoAssinatura;
  subs: Subscription[] = [];

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private assinaturaService: AssinaturaService,
    private buttonAlertService: ButtonAlertService
  ) { }

  ngOnInit(): void {
    const sub1 = this.assinaturaService.dadosAssinaturaParaGerar.subscribe({next: v => this.dadosAssinaturaParaGerar = v})
    const sub2 = this.assinaturaService.dadosParaResumoAssinatura.subscribe({next: v => this.resumoAssinatura = v})
    this.subs.push(sub1, sub2)
  }

  gerarAssinatura(){
    this.spinnerOpen();
    this.assinaturaService.gerarAssinatura(this.dadosAssinaturaParaGerar)
      .subscribe({
        next: v => {
          this.onAlert('Assinatura gerada com sucesso', 'primary')
          this.dismissModal();
          this.spinnerClose();
        },
        error: e => {
          this.onAlert(e.error.info, 'danger');
          this.spinnerClose();
        }
      })
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
