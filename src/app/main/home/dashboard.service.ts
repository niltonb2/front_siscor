import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICobDash } from '@core/types/ICobDash';
import { IDash } from '@core/types/IDash';
import { App } from 'app/app';
import { Token } from 'app/Utils/token';
import { URL_API } from 'environments/environment.prod';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  dadosCobrancaDashboard = new BehaviorSubject<IDash>({
    pagos: [],
    abertos: [],
    pendentes: [],
    vencidos: []
  });

  constructor(private http: HttpClient) { }

  getDadosDashboard(dataFrom, dataTo){
    const id = App.Instance.userInfo.estabelecimento_selecionado ? App.Instance.userInfo.estabelecimento_selecionado : Token.get('estabelecimento')
    return this.http.get<IDash>(`${URL_API}/cobranca/dashboard/${id}?data_from=${dataFrom}&data_to=${dataTo}`, {headers: new HttpHeaders({
      'Authorization': `Bearer ${Token.get('token')}`
    })})
  }

  getDadosDashboardMonth(dataFrom, dataTo){
    const id = App.Instance.userInfo.estabelecimento_selecionado ? App.Instance.userInfo.estabelecimento_selecionado : Token.get('estabelecimento')
    return this.http.get<IDash>(`${URL_API}/cobranca/dashboardmes/${id}?data_from=${dataFrom}&data_to=${dataTo}`, {headers: new HttpHeaders({
      'Authorization': `Bearer ${Token.get('token')}`
    })})
  }
}
