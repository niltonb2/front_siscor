import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-button-alert',
  templateUrl: './button-alert.component.html',
  styleUrls: ['./button-alert.component.scss']
})
export class ButtonAlertComponent implements OnInit {

  @Input() infoAlert: string = ''
  @Input() status: any = ''

  constructor() { }

  ngOnInit(): void {
  }

}
