import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-erro-pagamento',
  templateUrl: './erro-pagamento.component.html',
  styleUrls: ['./erro-pagamento.component.scss']
})
export class ErroPagamentoComponent implements OnInit {

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
