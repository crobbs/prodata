import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';

import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError, retry, window } from 'rxjs/operators';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { IfStmt } from '@angular/compiler';
import { LoginComponent } from '../user/login/login.component';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    constructor(private router: Router, private AuthService: AuthService,
        public login: LoginComponent) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('token interceptor', this.AuthService.getLocalToken())
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${this.AuthService.getLocalToken()}`
            }
        });

        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                // console.log('Evento Type', event);
                if (event instanceof HttpResponse) {
                    // console.log('Evento Type 2', event);
                    // this.AuthService.isAutenticate.next(false)
                    if (event.status === 200) {
                        console.log('Evento 200', event);

                        // this.AuthService.isAutenticate.next(true)
                    } else {
                        sessionStorage.clear();
                        // this.AuthService.isAutenticate.next(false)
                    }
                }

                return event;

            }
            ),
            retry(2),
            catchError((error: HttpErrorResponse) => {
                let data = {};
                data = {
                    reason: error && error.error.reason ? error.error.reason : '',
                    status: error.status,

                };
                console.log(error)
                if (error.status === 500) {
                    const dt2 = {
                        status: error.status,
                        statusText: error.error
                    };
                    console.log('token 500', this.AuthService.getLocalToken())

                }
                if (error.status === 503) {
                    const dt2 = {
                        status: error.status,
                        statusText: 'Serviço temporariamente indisponível. por favor tente novamente mais tarde.'
                    };


                    this.router.navigate(['login']);
                }
                if (error.status === 504) {
                    const dt2 = {
                        status: error.status,
                        statusText: 'O Servidou demorou muito para responder, verifique a conexão com a internet'
                    };


                    this.router.navigate(['login']);
                }

                if (error.status === 0) {
                    const dt2 = {
                        status: error.status,
                        statusText: 'Sem resposta do servidor, verifique a sua conexão de internet.'
                    };


                    this.router.navigate(['login']);
                }



                if (error.status === 401) {

                    const dt2 = {
                        status: '',
                        statusText: ''
                    };
                    /*sessionStorage.setItem('LoginActive',this.LoginActive ) */


                    if (this.router.url === '/login') {

                        dt2.status = error.status.toString()
                        dt2.statusText = 'Usuário ou senha inválido.'

                        // this.AuthService.isAutenticate.next(false);


                    } else {
                        if (this.router.url === '/cadastro' || this.router.url === '/lista') {
                            dt2.status = error.status.toString()
                            dt2.statusText = 'A sessão expirou.'

                            // this.AuthService.isAutenticate.next(false);
                            this.AuthService.logOut();
                            this.router.navigate(['login']);
                        }

                    } if (this.router.url.indexOf('editar') > -1) {
                        dt2.status = error.status.toString()
                        dt2.statusText = 'A sessão expirou.'

                        // this.AuthService.isAutenticate.next(false);
                        this.AuthService.logOut();
                        this.router.navigate(['login']);

                    }


                } else {
                    const dt2 = {
                        status: error.status,
                        statusText: error.error.status
                    };

                }
                return throwError(error);
            }));

    }
}
