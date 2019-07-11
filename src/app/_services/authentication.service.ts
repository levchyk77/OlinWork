import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private http: HttpClient
  ) { }

  // login
  login(username: string, password: string) {
    return this.http.post<any>('/users/authenticate', { username, password })
      .pipe(
        map(user => {
          // login succesful if the response has jwt token
          if (user && user.token) {
            // store user details and jwt token in the local storage
            localStorage.setItem('currentUser', JSON.stringify(user));
          }

          return user;
        })
      );
  }

  // logout
  logout() {
    // removes user from loval storage
    localStorage.removeItem('currentUser');
  }
}
