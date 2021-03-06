import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../_services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  returnUrl: string;
  submitted = false;
  loading = false;
  error: string;
  success: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService
  ) {
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    // will be added by AuthGuard
    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/home';

    // checks for query parameter that is added by register component in case of successful registration
    if (this.activatedRoute.snapshot.queryParams['registered']) {
      this.success = 'Registration successful';
    }
  }

  get logForm() { return this.loginForm.controls; }


  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    // reset alerts
    this.success = null;
    this.error = null;
    this.loading = true;
    // звернення до authentication service -> Observable.subscribe
    this.authenticationService.login(this.logForm.username.value, this.logForm.password.value)
      .subscribe(
        data => {
          this.router.navigate([this.returnUrl]);
          this.loading = false;
        },
        error => {
          this.error = error;
          this.loading = false;
        }
      );
  }


}
