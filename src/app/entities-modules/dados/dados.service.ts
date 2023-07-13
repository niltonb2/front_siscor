import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_API } from '../../../environments/environment';
import { Token } from '../../Utils/token';
import { IInfo } from '@core/types/IInfo';
import { BehaviorSubject } from 'rxjs';
import { IEndereco } from '@core/types/IEndereco';
import { IContato } from '@core/types/IContato';

@Injectable({
  providedIn: 'root'
})
export class DadosService {

  idContatoEditar: number;
  contatoParaEditar = new BehaviorSubject<IContato>({
    id: 0,
    telefone: '',
    celular: '',
    telefone_comercial: '',
    email: '',
    created_at: '',
    updated_at: '',
    deleted_at: '',
    deleted: false
  })

  idEnderecoEditar: number;
  enderecoParaEditar = new BehaviorSubject<IEndereco>({
    id: 0,
    tipo_endereco: '',
    cep: '',
    cidade: '',
    uf: '',
    logradouro: '',
    numero: '',
    bairro: '',
    complemento: '',
    created_at: '',
    updated_at: '',
    deleted_at: '',
    deleted: false
  })

  header = new HttpHeaders({
    'Authorization': `Bearer ${Token.get('token')}`
  })

  constructor(private http: HttpClient) { }

  buscarContato(id: number){
    return this.http.get<IContato>(`${URL_API}/dados/contato/${id}`, {headers: this.header})
  }

  cadastrarContato(entidade: string, id: number, dados: object){
    return this.http.post<IInfo>(`${URL_API}/dados/contato/${entidade}/${id}`, dados, {headers: this.header})
  }

  editarContato(contato){
    const body ={
      "celular": contato.celular,
      "email": contato.email
    }
    return this.http.put<IInfo>(`${URL_API}/dados/contato/${this.idContatoEditar}`, body, {headers: this.header})
  }

  cadastrarEndereco(entidade: string, id: number, dados: object){
    return this.http.post<IInfo>(`${URL_API}/dados/endereco/${entidade}/${id}`, dados, {headers: this.header})
  }

  buscarEndereco(id: number){
    return this.http.get<IEndereco>(`${URL_API}/dados/endereco/${id}`, {headers: this.header})
  }

  editarEndereco(endereco){
    return this.http.put<IInfo>(`${URL_API}/dados/endereco/${this.idEnderecoEditar}`, endereco, {headers: this.header})
  }

  cadastrarBancarios(entidade: string, id: number, dados: object){
    return this.http.post<IInfo>(`${URL_API}/dados/bancarios/${entidade}/${id}`, dados, {headers: this.header})
  }
}
