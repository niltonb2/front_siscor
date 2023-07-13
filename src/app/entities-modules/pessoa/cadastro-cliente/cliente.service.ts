import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { URL_API, URL_VIACEP } from '../../../../environments/environment';
import { Token } from '../../../Utils/token';
import { IInfo } from '@core/types/IInfo';
import { ICliente } from '@core/types/ICliente';
import { App } from 'app/app';
import { IClienteCompleto } from '@core/types/IClienteCompleto';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  header = new HttpHeaders({
    'Authorization': `Bearer ${Token.get('token')}`
  })

  logradouro = new BehaviorSubject<string>('');
  bairro = new BehaviorSubject<string>('');
  cidade = new BehaviorSubject<string>('');
  uf = new BehaviorSubject<string>('');

  idEstabelecimento: number;
  mostrarCadastroCliente = new BehaviorSubject<boolean>(false);
  mostrarEdicaoCliente = new BehaviorSubject<boolean>(false);

  idClienteEditar: number;

  clienteParaEditar = new BehaviorSubject<IClienteCompleto>({
    bairro: "",
    celular: "",
    cep: "",
    cidade: "",
    complemento: "",
    documento: "",
    email: "",
    estado: "",
    logradouro: "",
    nome: "",
    numero: "",
    uf: ""
  })

  constructor(private http: HttpClient) { }

  buscarEnderecoPeloCep(cep: string) {
    return this.http.get<any>(`${URL_VIACEP}/${cep}/json/`)
  }

  cadastrar(pessoa) {

    const { nome, documento } = pessoa
    const tipo_documento = documento.length == 11 ? 'F' : 'J'
    const body = {
      "nome": nome,
      "tipo": 'CL',
      "documento": documento,
      "tipo_documento": tipo_documento,
      "estabelecimento": App.Instance.userInfo.estabelecimento_selecionado
    }

    return this.http.post<IInfo>(`${URL_API}/pessoa/save`, body, { headers: this.header })
  }

  editar(pessoa) {
    const { nome, documento } = pessoa
    const tipo_documento = documento.length == 11 ? 'F' : 'J'

    const body = {
      "nome": nome,
      "tipo": 'CL',
      "documento": documento,
      "tipo_documento": tipo_documento,
    }

    return this.http.put<IInfo>(`${URL_API}/pessoa/${this.idClienteEditar}`, body, { headers: this.header })
  }

  buscar(id) {
    //const id = App.Instance.userInfo.estabelecimento_selecionado ? App.Instance.userInfo.estabelecimento_selecionado : Token.get('estabelecimento') 
    return this.http.get<ICliente[]>(`${URL_API}/pessoa/${id}`, { headers: this.header })
  }

  buscarClientesCobranca(estabelecimento: number) {
    return this.http.get<ICliente[]>(`${URL_API}/pessoa/${estabelecimento}`, { headers: this.header })
  }

  buscarCadastroCompleto(id: number) {
    return this.http.get<IClienteCompleto[]>(`${URL_API}/pessoacompleta/${id}`, { headers: this.header })

  }

  buscarPorEc(estabelecimento) {
    return this.http.get<ICliente[]>(`${URL_API}/pessoa/${estabelecimento}`, { headers: this.header })
  }

  deletar(id: number) {
    return this.http.delete<IInfo>(`${URL_API}/pessoa/${id}`, { headers: this.header })
  }
}
