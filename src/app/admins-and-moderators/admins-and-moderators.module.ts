import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin/admin.component';
import { UsersListComponent } from './users-list/users-list.component';
import { ModeratorsListComponent } from './moderators-list/moderators-list.component';
import { ModeratorComponent } from './moderator/moderator.component';

@NgModule({
  declarations: [
    AdminComponent,
    UsersListComponent,
    ModeratorsListComponent,
    ModeratorComponent
  ],
  imports: [
    CommonModule
  ]
})
export class AdminsAndModeratorsModule { }
