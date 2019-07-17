import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

/* public currentUser property allows other components to subscribe to the currentUser
  but doesn't allow to publish to currentUserSubject ( what can be done only via login/logout methods of
  the  authentication service)
 */
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // gives an opportunity to access the currently logged in user without having to subscribe to the currentUser Observable
  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  // login
  login(username: string, password: string) {
    return this.http.post<User>('/users/authenticate', { username, password })
      .pipe(
        map(user => {
          // login succesful if the response has jwt token
          if (user && user.token) {
            // store user details and jwt token in the local storage
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
          }

          return user;
        })
      );
  }

  // logout
  logout() {
    // removes user from loval storage
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
