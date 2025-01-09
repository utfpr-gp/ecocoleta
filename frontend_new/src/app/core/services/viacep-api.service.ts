import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ViacepApiService {
  private readonly API_URL = 'https://viacep.com.br/ws';

  constructor(private httpClient: HttpClient) {}

  buscarCep(cep: string): Observable<any> {
    return this.httpClient.get(`${this.API_URL}/${cep}/json`).pipe(
      catchError((err) => {

        console.error('Erro na requisição da API ViaCEP:', err); //TODO remover

        throw err;
      })
    );
  }
}
