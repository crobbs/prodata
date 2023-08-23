
import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public perfilAtual: any;
  authState: boolean = false;

  constructor(
    private authService: AuthService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.authService.isAutenticate.subscribe((isAuth: any) => {
      console.log('isAuth', isAuth);
      if (isAuth === false) {
        this.router.navigate(['login']);
      }
    });
  }
}