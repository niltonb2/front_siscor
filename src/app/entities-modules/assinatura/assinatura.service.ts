import { Injectable } from '@angular/core';
import { IAssinatura } from '@core/types/IAssinatura';
import { BehaviorSubject } from 'rxjs';
import { URL_API } from 'environments/environment';
import { Token } from 'app/Utils/token';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AssinaturaService {

  dadosAssinaturaParaGerar = new BehaviorSubject<any>({});
  dadosParaResumoAssinatura = new BehaviorSubject<any>({});

  constructor(private http: HttpClient) { }

  gerarAssinatura(assinatura: IAssinatura) {
    return this.http.post<IAssinatura[]>(`${URL_API}/assinatura`, assinatura, {headers: new HttpHeaders({
      'Authorization': `Bearer ${Token.get('token')}`
    })})
  }

  buscarAssinatura(cliente: number) {
    return this.http.get<IAssinatura[]>(`${URL_API}/assinaturacliente/${cliente}`, {headers: new HttpHeaders({
      'Authorization': `Bearer ${Token.get('token')}`
    })})
  }
}
