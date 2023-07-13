import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Token } from '../../../Utils/token';
import { URL_API } from 'environments/environment';
import { IEstabelecimento } from '@core/types/IEstabelecimento';
import { IInfo } from '@core/types/IInfo';
import { BehaviorSubject } from 'rxjs';
import { App } from 'app/app';
import { IGateway } from '@core/types/IGateway';
import { IEstabelecimentoCompleto } from '@core/types/IEstabelecimentoCompleto';
import { UserService } from 'app/auth/service';

@Injectable({
  providedIn: 'root'
})
export class EstabelecimentoService {

  estabelecimentoSelecionado = new BehaviorSubject<string>('');
  mostrarCadastroEstabelecimento = new BehaviorSubject<boolean>(false);
  mostrarEdicaoEstabelecimento = new BehaviorSubject<boolean>(false);
  gatewayConfigurado = new BehaviorSubject<boolean>(true);
  idEstabelecimentoParaEditar: string;
  idGatewayEditar: number;

  estabelecimentoParaEditar = new BehaviorSubject<IEstabelecimentoCompleto>({
    bairro: '',
    celular: '',
    cep: '',
    cidade: '',
    complemento: '',
    documento: '',
    email: '',
    estado: '',
    fantasia: '',
    gateway: 0,
    logradouro: '',
    nome: '',
    numero: '',
    telefone: '',
    telefone_comercial: '',
    tipo_documento: '',
    tipo_endereco: '',
    uf: '',
    nome_gateway: '',
    marketplace_id: '',
    seller_id: '',
    nome_estabelecimento: ''
  })

  fantasia = new BehaviorSubject<string>('');

  header = new HttpHeaders({
    'Authorization': `Bearer ${Token.get('token')}`
  })

  constructor(
    private _http: HttpClient,
    private userService: UserService
    ) { }

  cadastrar(estabelecimento) {
    return this._http.post<IInfo>(`${URL_API}/estabelecimento`, estabelecimento, {headers: new HttpHeaders({
      'Authorization': `Bearer ${Token.get('token')}`
    })})
  }

  getEcClean(){
    return this._http.get<IEstabelecimento[]>(`${URL_API}/estabelecimento`, {headers: new HttpHeaders({
      'Authorization': `Bearer ${Token.get('token')}`
    })})
  }

  editar(estabelecimento) {
    return this._http.put<IInfo>(`${URL_API}/estabelecimento/${this.idEstabelecimentoParaEditar}`, estabelecimento, {headers: new HttpHeaders({
      'Authorization': `Bearer ${Token.get('token')}`
    })})
  }

  criarSeller(estabelecimento){
    return this._http.post<any>(`${URL_API}/sellers`, estabelecimento, {headers: new HttpHeaders({
      'Authorization': `Bearer ${Token.get('token')}`
    })})
  }

  cadastrarGateway(gateway) {
    return this._http.post<IGateway>(`${URL_API}/gateway`, gateway, {headers: new HttpHeaders({
      'Authorization': `Bearer ${Token.get('token')}`
    })})
  }

  editarGateway(gateway) {
    return this._http.put<IInfo>(`${URL_API}/gateway/${this.idGatewayEditar}`, gateway, {headers: new HttpHeaders({
      'Authorization': `Bearer ${Token.get('token')}`
    })})
  }

  setGateway(estabelecimento, gateway) {
    const body = {

    }
    return this._http.patch<IInfo>(`${URL_API}/estabelecimento/${estabelecimento}/${gateway}`, body, {headers: new HttpHeaders({
      'Authorization': `Bearer ${Token.get('token')}`
    })})
  }

  setConfig(estabelecimento, config){
    return this._http.patch<IInfo>(`${URL_API}/estabelecimentosetconfig/${estabelecimento}`, config, {headers: new HttpHeaders({
      'Authorization': `Bearer ${Token.get('token')}`
    })})
  }

  buscar() {
    const id = App.Instance.userInfo.id ? App.Instance.userInfo.id : Token.get('usuario') 
    return this._http.get<IEstabelecimento[]>(`${URL_API}/estabelecimento/usuario/${id}`, {headers: new HttpHeaders({
      'Authorization': `Bearer ${Token.get('token')}`
    })})
  }

  buscarDadosEmpresa(cnpj: string) {
    return this._http.get<any>(`${URL_API}/dadosempresa/${cnpj}`, {headers: new HttpHeaders({
      'Authorization': `Bearer ${Token.get('token')}`
    })})
  }

  buscarPorId(id: number) {
    return this._http.get<IEstabelecimento[]>(`${URL_API}/estabelecimento/${id}`, {headers: new HttpHeaders({
      'Authorization': `Bearer ${Token.get('token')}`
    })})
  }

  buscarEstabelecimentoDadosCompletos(id: number) {
    return this._http.get<IEstabelecimentoCompleto[]>(`${URL_API}/estabelecimentocompleto/${id}`, {headers: new HttpHeaders({
      'Authorization': `Bearer ${Token.get('token')}`
    })})
  }

  deletar(id: number) {
    return this._http.delete<IInfo>(`${URL_API}/estabelecimento/${id}`, {headers: new HttpHeaders({
      'Authorization': `Bearer ${Token.get('token')}`
    })})
  }

  verificarSeEstabelecimentoJaExiste(documento){
    return this._http.get<IEstabelecimento[]>(`${URL_API}/estabelecimentoverificar/${documento}`, {headers: new HttpHeaders({
      'Authorization': `Bearer ${Token.get('token')}`
    })})
  }

}
