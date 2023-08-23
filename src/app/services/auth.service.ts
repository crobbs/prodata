import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import jwt_decode from "jwt-decode";



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public token_autorize: any;
  public token: any;
  apiKey = 'AIzaSyA1ei1HJkyPn_cL_1oD_JLcvfNPyV-vFSI'
  baseUrl = 'gate/api/';
  baseUrlLogin = 'gate/';
  public isAutenticate: any = new BehaviorSubject<boolean>(true);
  public Usuario: any;
  public Perfil: any;
  public usuarioSCA: any;

  httpOptions = {
    headers: new HttpHeaders({
      Host: 'h-apps.mprj.mp.br',
      Connection: 'Keep-alive',
      observe: 'Response'
    })
  };
  constructor(
    private httpClient: HttpClient
  ) {
    this.isAutenticate.asObservable();
  }



  public getToken(loginPayload: any) {
    // this.httpClient.post(this.baseUrlLogin + "user/login", loginPayload, { observe: 'response' })
    return this.httpClient.post(this.baseUrlLogin + "user/login", loginPayload, { observe: 'response' })
  }

  public getUser() {

    return this.httpClient.get(this.baseUrl + 'getUser')
  }


  public getAuth(token: any): Observable<any> {
    //const login = { "username": "anderson.valgas", "password": "bx11ts" }
    console.log('Body Token', token);
    this.token_autorize = jwt_decode(token);
    let httpHeaders = new HttpHeaders();
    httpHeaders.append('Authorization', 'Bearer ' + token);
    httpHeaders.append('Content-Type', 'application/json');
    httpHeaders.append("Accept", "*/*")
    localStorage.setItem('BearerToken', token)
    var reqHeader = new HttpHeaders({
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json",
      "Accept": "*/*"
    });
    let body = { "application": this.token_autorize.appId, "role": this.token_autorize.roles[0] } //{"application": "GATE", "role": "Gestor"}//
    let options2 = { headers: httpHeaders };
    return this.httpClient.post(this.baseUrlLogin + "user/authorizeRole", body, options2)
  }
  public setUser(token: any) {
    const loggedUser = JSON.stringify(token);
    localStorage.setItem('loggedUser', loggedUser);
    this.usuarioSCA = token;
    this.Usuario = localStorage.setItem('Usuario', token.name);
    this.Perfil = localStorage.setItem('Perfil', token.roles[0]);
    console.log(this.Usuario)
  }

  public getLocalToken() {
    return localStorage.getItem('BearerToken');
  }
  loginSuccess() {
    this.isAutenticate.next(true);
  }

  logOut() {
    this.isAutenticate.next(false);
    sessionStorage.clear();
    localStorage.clear();
    return this.httpClient.post(this.baseUrlLogin + 'user/logout', { Accept: '*/*' });
  }
}
