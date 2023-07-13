import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Token } from '../../Utils/token';
import { URL_API } from 'environments/environment';
import { IInfo } from '@core/types/IInfo';
import { ICobranca } from '@core/types/ICobranca';
import { BehaviorSubject } from 'rxjs';
import { App } from 'app/app';

@Injectable({
  providedIn: 'root'
})
export class CobrancaService {

  mostrarTelaCobranca = new BehaviorSubject<any>(false);

  cobrancaVisualizar = new BehaviorSubject<ICobranca>({
    data_vencimento: '',
    estabelecimento: 0,
    pessoa: 0,
    status: '',
    usuario: 0,
    valor: '',
    valor_original: ''
  })

  header = new HttpHeaders({
    'Authorization': `Bearer ${Token.get('token')}`
  })

  constructor(private http: HttpClient) { }

  gerarCobranca(cobranca: ICobranca) {
    return this.http.post<IInfo>(`${URL_API}/cobranca`, cobranca, {headers: new HttpHeaders({
      'Authorization': `Bearer ${Token.get('token')}`
    })})
  }

  getCobrancas() {
    const id = App.Instance.userInfo.estabelecimento_selecionado ? App.Instance.userInfo.estabelecimento_selecionado : Token.get('estabelecimento')
    return this.http.get<ICobranca[]>(`${URL_API}/cobrancacompleta/${id}`, {headers: new HttpHeaders({
      'Authorization': `Bearer ${Token.get('token')}`
    })})
  }

}
