import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_API, API_KEY } from '../../../environments/environment';
import { Token } from '../../Utils/token';
import { ICobranca } from '../../../@core/types/ICobranca'
import { BehaviorSubject } from 'rxjs';
import { IInfo } from '@core/types/IInfo';


@Injectable({
  providedIn: 'root'
})
export class PortalClienteService {

  nomeClienteAcesso = new BehaviorSubject<string>('');
  openModalAguarde = new BehaviorSubject<boolean>(false);

  idCobrancaParaPagamento: number;
  cobrancaParaPagamento = new BehaviorSubject<ICobranca>({
    data_vencimento: '',
    estabelecimento: 0,
    pessoa: 0,
    status: '',
    usuario: 0,
    valor: '',
    valor_original: '',
    id: 0
  })

  header = new HttpHeaders({
    'Authorization': ``,
    'api_key': ``,
    'marketplace_id': ``
  })

  constructor(private http: HttpClient) { }

  buscarCobrancaPorDocumento(documento: string) {
    return this.http.get<ICobranca[]>(`${URL_API}/cobranca/${documento}`)
  }

  buscarPessoaPorDocumento(documento: string) {
    return this.http.get<ICobranca[]>(`${URL_API}/pessoadocumento/${documento}`)
  }

  pagarCobranca() {
    return this.http.patch<IInfo>(`${URL_API}/cobranca/pagar/${this.idCobrancaParaPagamento}`, {})
  }

  gerarBoleto(cobrancaBoleto, marketplace_id) {
    return this.http.post<any>(`${URL_API}/checkout/transaction`, cobrancaBoleto, {headers: new HttpHeaders({
      'api_key': API_KEY,
      'marketplace_id': marketplace_id,
      'Content-Type': 'application/json'
    })})
  }

}
