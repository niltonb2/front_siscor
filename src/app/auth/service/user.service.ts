import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_API } from 'environments/environment';
import { IUsuario } from '../../../@core/types/IUsuario';
import { IUserEc } from '../../../@core/types/IUserEc';
import { IInfo } from '../../../@core/types/IInfo';
import { Token } from '../../Utils/token';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {

  usuarioLogado = new BehaviorSubject<IUsuario>({
    nome: '',
    email: ''
  });

  qtdeEcs = new BehaviorSubject<IUserEc[]>([])

  header = new HttpHeaders({
    'Authorization': `Bearer ${Token.get('token')}`
  })

  /**
   *
   * @param {HttpClient} _http
   */
  constructor(private _http: HttpClient) {
  }

  register(usuario) {
    const bodyUsuario = {
      "nome": usuario.name,
      "email": usuario.email,
      "senha": usuario.password
    }
    return this._http.post<IInfo>(`${URL_API}/usuarios/save`, bodyUsuario)
  }

  login(usuario) {
    const bodyUsuario = {
      "email": usuario.email,
      "senha": usuario.password
    }
    return this._http.post<IInfo>(`${URL_API}/usuarios/login`, bodyUsuario)
  }

  getDadosUser(token: string) {
    return this._http.get<IUsuario>(`${URL_API}/usuariodados`, {headers: new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })})
  }

  selecionarEstabelecimento(usuario, estabelecimentoId) {
    const body = {}
    return this._http.put<IInfo>(`${URL_API}/usuarios/${usuario}/${estabelecimentoId}`, body,{headers: new HttpHeaders({
      'Authorization': `Bearer ${Token.get('token')}`
    })})
  }

  getQtdeEcsByUser() {
    return this._http.get<any>(`${URL_API}/usuarioestabelecimento`,{headers: new HttpHeaders({
      'Authorization': `Bearer ${Token.get('token')}`
    })})
  }
}
