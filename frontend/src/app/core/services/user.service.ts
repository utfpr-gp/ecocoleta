import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../types/user.type';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl: string = environment.API;

  constructor(private httpClient: HttpClient) {}

  getUser(): Observable<User> {
    // return this.httpClient.get<User>(`${this.apiUrl}/user`);
    return this.httpClient.get<User>(`${this.apiUrl}/hello`); // TODO Alterado para testar a API
  }

  createUser(user: User): Observable<User> {
    return this.httpClient.post<User>(`${this.apiUrl}/user`, user);
  }
}
