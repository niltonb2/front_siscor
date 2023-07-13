import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IUserEc } from '@core/types/IUserEc';
import { App } from 'app/app';
import { UserService } from 'app/auth/service';
import { EstabelecimentoService } from 'app/entities-modules/estabelecimento/cadastro-estabelecimento/estabelecimento.service';
import { TableCobrancaComponent } from '../table-cobranca/table-cobranca.component';

@Component({
  selector: 'app-selecionar-estabelecimento',
  templateUrl: './selecionar-estabelecimento.component.html',
  styleUrls: ['./selecionar-estabelecimento.component.scss']
})
export class SelecionarEstabelecimentoComponent implements OnInit {
  

  @ViewChild(TableCobrancaComponent)
  tableCobrancaComponent: TableCobrancaComponent

  estabelecimentosPorUsuario: IUserEc[] = [];

  selectEstabelecimento = new FormGroup({
    estabelecimento: new FormControl('')
  })

  constructor(
    private _userService: UserService,
    private estabelecimentoService: EstabelecimentoService
  ) { }

  ngOnInit(): void {
    this.estabelecimentoService.estabelecimentoSelecionado.subscribe({
      next: ec => this.selectEstabelecimento.controls.estabelecimento.setValue(ec)
    })

    this._userService.getQtdeEcsByUser()
    .subscribe({
      next: ecs => {
        this.estabelecimentosPorUsuario = ecs
      },
      error: e => console.log(e)
    })
  }

  selecionar(){
    const [ id, nome ] = this.selectEstabelecimento.value.estabelecimento.split('_')
    this.estabelecimentoService.estabelecimentoSelecionado.next(nome)
    this._userService.selecionarEstabelecimento(App.Instance.userInfo.id, id)
      .subscribe({
        next: v => {
          window.location.reload();
        },
        error: e => console.log(e)
      })
  }

}
