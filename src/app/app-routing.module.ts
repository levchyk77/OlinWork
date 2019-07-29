import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './_helpers';
import { AdminComponent } from './admins-and-moderators/admin/admin.component';
import { Role } from './_models';
import { FindJobsComponent } from './find-jobs/find-jobs.component';
import { ModeratorComponent } from './admins-and-moderators/moderator/moderator.component';

const routes: Routes = [
  { path: 'find-jobs', component: FindJobsComponent},
  { path: 'login', component: LoginComponent },
  {
    path: 'home',
    component: HomeComponent
  },
  { path: 'register', component: RegisterComponent },
  {
    path: 'moderator',
    component: ModeratorComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.Moderator]}
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.Admin]}
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
