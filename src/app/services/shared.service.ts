import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private loggedInStatus = new BehaviorSubject<boolean>(false);

  get isLoggedIn() {
    return this.loggedInStatus.asObservable();
  }

  loginSuccess() {
    this.loggedInStatus.next(true);
  }
}
