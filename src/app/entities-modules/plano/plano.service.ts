import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { URL_API } from 'environments/environment';
import { Token } from 'app/Utils/token';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { App } from 'app/app';
import { IPlano } from '@core/types/IPlano';
import { IProduto } from '@core/types/IProduto';

@Injectable({
  providedIn: 'root'
})
export class PlanoService {

  mostrarTelaPlano = new BehaviorSubject<any>(false);
  mostrarTelaPlanoEditar = new BehaviorSubject<any>(false);
  produtosPlano = new BehaviorSubject<IProduto[]>([]);
  idPlanoParaEditar;
  dadosPlanoParaEditar = new BehaviorSubject<IPlano>({
    descricao: '',
    estabelecimento: 0,
    id: 0,
    tipo: 0,
    valor: 0
  })

  constructor(private http: HttpClient) { }

  getPlanos() {
    const id = App.Instance.userInfo.estabelecimento_selecionado ? App.Instance.userInfo.estabelecimento_selecionado : Token.get('estabelecimento')
    return this.http.get<IPlano[]>(`${URL_API}/plano/${id}`, {headers: new HttpHeaders({
      'Authorization': `Bearer ${Token.get('token')}`
    })})
  }

  cadastrar(plano) {
    const body = {
      ...plano
    }

    return this.http.post<IPlano[]>(`${URL_API}/plano`, body,{headers: new HttpHeaders({
      'Authorization': `Bearer ${Token.get('token')}`
    })})
  }

  editar(plano) {
    const body = {
      ...plano
    }
    return this.http.put<IPlano[]>(`${URL_API}/plano/${this.idPlanoParaEditar}`, body,{headers: new HttpHeaders({
      'Authorization': `Bearer ${Token.get('token')}`
    })})
  }
}
