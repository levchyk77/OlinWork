import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { UserService, AuthenticationService } from '../_services';

@Component({
   templateUrl: 'home.component.html',
   styleUrls: ['home.component.css']
 })
export class HomeComponent {


  constructor() { }
}
