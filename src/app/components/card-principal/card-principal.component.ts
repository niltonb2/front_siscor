import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { App } from 'app/app';
import { UserService } from 'app/auth/service';
import { Token } from 'app/Utils/token';
import { Subscription } from 'rxjs';
import { TablePrincipalComponent } from '../table-principal/table-principal.component';
import { CardPrincipalService } from './card-principal.service';

@Component({
  selector: 'app-card-principal',
  templateUrl: './card-principal.component.html',
  styleUrls: ['./card-principal.component.scss']
})
export class CardPrincipalComponent implements OnInit, OnDestroy {

  @Input() nomeEntidade: string;
  @Input() corBotao: string;
  @Input() cadastroNow: boolean;
  @Input() nomeBotao: string;

  @ViewChild('tablePrincipal', {static: true})
  tablePrincipalComponent: TablePrincipalComponent;

  @Output() clickButton = new EventEmitter<any>();

  subs: Subscription[] = [];

  constructor(
    private cardPrincipalService: CardPrincipalService
  ) { 
    const sub = this.cardPrincipalService.mostrarTelaCadastro.subscribe({
      next: value => this.cadastroNow = value
    })

    this.subs.push(sub)
    this.inicializar()
  }
  
  ngOnInit(): void {
  }

  inicializar(){
    if(this.tablePrincipalComponent) this.tablePrincipalComponent.inicializar();
  }
  
  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  abrirTelaCadastro(){
    this.clickButton.emit();
  }

}
