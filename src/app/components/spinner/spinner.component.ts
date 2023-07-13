import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {

  public progressbarHeight = '.857rem';
  public valorProgresso = 0;

  constructor(
    private activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {

    setInterval(() => {
      //this.valorProgresso += 1
      this.valorProgresso == 1000 ? this.valorProgresso = 0 : this.valorProgresso += 10
    }, 80)
  }

  dismissModal() {
    this.activeModal.dismiss();
  }

  closeModal() {
    this.activeModal.close();
  }

}
