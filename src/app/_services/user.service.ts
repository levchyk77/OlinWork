import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../_models';

/* is used for getting the list of users, send registration request and deleting users */
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<User[]>(`/users`);
  }

  register(user) {
    return this.http.post(`/users/register`, user);
  }

  delete(id) {
    return this.http.delete(`/users/${id}`);
  }
}
