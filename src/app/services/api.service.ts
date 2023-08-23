import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';
import { retry, catchError, tap, map, filter, mergeMap } from 'rxjs/operators';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { ErrorHandlerService } from '../core/error-handler.service';
import { Solicitante, } from '../model/solicitante.model';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseUrl = 'gate/api/';
  constructor(private httpClient: HttpClient) { }


  getSolicitantes() {
    return this.httpClient.get<Solicitante[]>(this.baseUrl + 'listaSolicitantes').pipe(
      retry(1),
      catchError(this.handleError));

  }

  handleError(error: any) {

    let errorMessage = '';
    let resultado = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {

      if (error.status === 401) {
        // this.router.navigate(['login']);
        // console.log('Erro 401', error.status);

      }

      resultado = error.message.substring(error.message.indexOf('api') + 3);
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message} \nUrl: ${error.url}`;
    }
    return throwError(errorMessage);
  }
}
