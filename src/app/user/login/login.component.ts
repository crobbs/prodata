import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { AuthService } from 'src/app/services/auth.service';
import jwt_decode from "jwt-decode";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username: string = 'charles.robbs';
  password: string = 'chy1z4';
  loading = false;
  loadingText = '';
  formValid = true;
  showForm = false;
  constructor(
    private sharedService: SharedService,
    public authService: AuthService,
    public router: Router
  ) { }

  ngOnInit(): void {
    try {
      this.authService.getUser().subscribe(
        (usr: any) => {
          const usrString = localStorage.getItem('loggedUser');
          console.log('loggedUserloggedUserloggedUser', usrString);
          if (usrString) {
            this.authService.isAutenticate.next(true)
            this.showForm = false;
            this.router.navigate(['sat']);
          } else {
            this.authService.isAutenticate.next(false)
            this.showForm = true;
          }
        },
        (error) => {
          this.showForm = true;
          console.error('An error occurred:', error);
          // Handle the error here, e.g., show an error message to the user
        });
    } catch (err) {
      this.authService.isAutenticate.next(false)
      this.showForm = true;
      console.log('errerrerrerr', err);
    }

  }

  onSubmit() {
    this.loading = true
    this.loadingText = "Realizando autenticação..."
    if (this.formValid === false) {
      this.loadingText = "Formulario inválido"
      return;
    }
    const loginPayload = {
      username: this.username,
      password: this.password
    };
    this.authService.getToken(loginPayload).subscribe((response: any) => {
      console.log('resposta login ', response)
      if (response.body.error === null) {
        this.loadingText = "Autenticação realizada com sucesso!"
        this.authService.getAuth(response.body.data.token).subscribe((response: any) => {
          const tok = jwt_decode(response.data.token)
          this.authService.setUser(tok)
          this.loading = false
          setTimeout(() => {
            this.authService.isAutenticate.next(true)
            this.router.navigate(['sat']);
          }, 1500);
        })
        console.log('Login successful!');
      }
      if (response.body.error !== null && response.body.error.code === 403) {
        const dt2 = {
          status: 401,
          statusText: response.body.error.message
        };
        this.loadingText = "Não foi possível realizar sua autenticação com o usuário e senha utilizados. Confira seus dados e tente novamente."
        this.loading = false
        console.log('token 500', this.authService.getLocalToken())
        // this.errorDialogService.openDialog(dt2);
      }

    })

  }
}
