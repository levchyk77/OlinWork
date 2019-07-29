import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './_services';
import { Role, User } from './_models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'OlinWork';
  currentUser: User;
  userRole: Role;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }
  ngOnInit() {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  get isAdmin() {
    return this.currentUser && this.currentUser.role === Role.Admin;
  }
  get isModerator() {
    return this.currentUser && this.currentUser.role === Role.Moderator;
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
