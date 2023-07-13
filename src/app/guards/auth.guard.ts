import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { App } from 'app/app';
import { UserService } from 'app/auth/service';
import { EstabelecimentoService } from 'app/entities-modules/estabelecimento/cadastro-estabelecimento/estabelecimento.service';
import { Observable } from 'rxjs';
import { Token } from '../Utils/token';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {

  idEstabelecimentoParaBusca: number;

  constructor(
    private router: Router,
    private _userService: UserService,
    private estabelecimentoService: EstabelecimentoService
  ) { }

  canLoad(
    
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const token = Token.get('token');

    if (!token) {
      this.authRecused();
      return;
    }

    this._userService.getDadosUser(token)
      .subscribe({
        next: usuario => {
          Token.insert('estabelecimento', usuario.estabelecimento_selecionado)
          Token.insert('usuario', usuario.id)
          App.Instance.setUserInfo(usuario)
          this._userService.usuarioLogado.next(usuario)
          if(usuario.estabelecimento_selecionado) this.estabelecimentoService.buscarPorId(usuario.estabelecimento_selecionado)
          .subscribe({
            next: value => this.estabelecimentoService.estabelecimentoSelecionado.next(value[0].nome)
          })
        },
        error: e => console.log(e)
      })

    this._userService.getQtdeEcsByUser()
      .subscribe({
        next: ecs => {
          this._userService.qtdeEcs.next(ecs)
        },
        error: e => console.log(e)
      })


    return true;
  }

  authRecused() {
    Token.clearStorage();
    this.router.navigate(['/pages/authentication/login'])
    return false;
  }
}
