import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-infos-field',
  templateUrl: './infos-field.component.html',
  styleUrls: ['./infos-field.component.scss']
})
export class InfosFieldComponent implements OnInit {

  @Input() mensagem: string;

  constructor() { }

  ngOnInit(): void {
  }

}
