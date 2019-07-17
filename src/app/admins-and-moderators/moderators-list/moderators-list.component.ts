import { Component, OnInit } from '@angular/core';
import { AuthenticationService, UserService } from 'src/app/_services';
import { User } from 'src/app/_models';
import { first } from 'rxjs/operators';


@Component({
  selector: 'app-moderators-list',
  templateUrl: './moderators-list.component.html',
  styleUrls: ['./moderators-list.component.css']
})
export class ModeratorsListComponent implements OnInit {
  currentUser: User;
  users: User[];

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
   }

  ngOnInit() {
    this.loadAllModerators();
  }

  deleteUser(id: number) {
    this.userService.delete(id)
      .pipe(first())
      .subscribe(() => this.loadAllModerators());
  }

  private loadAllModerators() {
    this.userService.getAll(0)
      .pipe(first())
      .subscribe(users => this.users = users);
  }

}
