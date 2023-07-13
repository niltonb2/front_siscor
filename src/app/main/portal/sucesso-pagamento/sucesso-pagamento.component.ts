import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sucesso-pagamento',
  templateUrl: './sucesso-pagamento.component.html',
  styleUrls: ['./sucesso-pagamento.component.scss']
})
export class SucessoPagamentoComponent implements OnInit {

  constructor(
    private activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
  }

  dismissModal() {
    this.activeModal.dismiss();
  }

  closeModal(){
    this.activeModal.close();
  }


}
