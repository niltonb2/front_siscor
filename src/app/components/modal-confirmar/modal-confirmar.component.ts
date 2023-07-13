import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal-confirmar',
  templateUrl: './modal-confirmar.component.html',
  styleUrls: ['./modal-confirmar.component.scss']
})
export class ModalConfirmarComponent implements OnInit {

  @Output() dismiss = new EventEmitter<any>();
  @Output() confirmaExclusao = new EventEmitter<any>();

  @Input() nomeEntidade: string;

  constructor() { }

  ngOnInit(): void {
  }

  modalDismiss() {
    this.dismiss.emit();
  }

  excluir() {
    this.confirmaExclusao.emit();
  }

}
