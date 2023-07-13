import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PortalClienteService } from 'app/main/portal/portal-cliente.service';

@Component({
  selector: 'app-modal-aguarde',
  templateUrl: './modal-aguarde.component.html',
  styleUrls: ['./modal-aguarde.component.scss']
})
export class ModalAguardeComponent implements OnInit {

  constructor(
    private activeModal: NgbActiveModal,
    private portalClienteService: PortalClienteService
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
