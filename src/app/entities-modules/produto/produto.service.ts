import { Injectable } from '@angular/core';
import { IProduto } from '@core/types/IProduto';
import { App } from 'app/app';
import { BehaviorSubject } from 'rxjs';
import { URL_API } from 'environments/environment';
import { Token } from 'app/Utils/token';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IInfo } from '@core/types/IInfo';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  mostrarTelaProduto = new BehaviorSubject<any>(false);
  mostrarTelaEditarProduto = new BehaviorSubject<any>(false);
  listaProdutosSelectPlano = new BehaviorSubject<any[]>([]);
  idProdutoParaEditar: number;
  idProdutoParaDeletar: number;

  dadosProdutoParaEditar = new BehaviorSubject<IProduto>({
    descricao: "",
    estabelecimento: 0,
    id: 0,
    tipo: 0,
    valor: 0
  })

  constructor(private http: HttpClient) { }

  getProdutos() {
    const id = App.Instance.userInfo.estabelecimento_selecionado ? App.Instance.userInfo.estabelecimento_selecionado : Token.get('estabelecimento')
    return this.http.get<IProduto[]>(`${URL_API}/produto/${id}`, {headers: new HttpHeaders({
      'Authorization': `Bearer ${Token.get('token')}`
    })})
  }

  getProdutoById(id) {
    return this.http.get<IProduto[]>(`${URL_API}/produtobyid/${id}`, {headers: new HttpHeaders({
      'Authorization': `Bearer ${Token.get('token')}`
    })})
  }

  deletar() {
    return this.http.delete<IInfo>(`${URL_API}/produto/${this.idProdutoParaDeletar}`, {headers: new HttpHeaders({
      'Authorization': `Bearer ${Token.get('token')}`
    })})
  }

  verificarProdutoPlano() {
    return this.http.get<IProduto[]>(`${URL_API}/produtovificarplano/${this.idProdutoParaDeletar}`, {headers: new HttpHeaders({
      'Authorization': `Bearer ${Token.get('token')}`
    })})
  }

  cadastrar(produto) {
    const id = App.Instance.userInfo.estabelecimento_selecionado ? App.Instance.userInfo.estabelecimento_selecionado : Token.get('estabelecimento')
    const body = {
      ...produto,
      "estabelecimento": id
    }

    return this.http.post<IProduto[]>(`${URL_API}/produto`, body,{headers: new HttpHeaders({
      'Authorization': `Bearer ${Token.get('token')}`
    })})
  }

  editar(produto) {
    return this.http.put<IInfo>(`${URL_API}/produto/${this.idProdutoParaEditar}`, produto,{headers: new HttpHeaders({
      'Authorization': `Bearer ${Token.get('token')}`
    })})
  }
}
