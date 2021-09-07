import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './home/header/header.component';
import { RegisterComponent } from './home/register/register.component';
import { LoginComponent } from './home/login/login.component';
import { UpdateUserComponent } from './home/update-user/update-user.component';
import { ListBoardComponent } from './board/list-board/list-board.component';
import { RegisterBoardComponent } from './board/register-board/register-board.component';
import { ListTaskComponent } from './board/task/list-task/list-task.component';
import { CreateTaskComponent } from './board/task/create-task/create-task.component';
import { InviteUserComponent } from './board/invite-user/invite-user.component';
import { CreateCommentsComponent } from './board/comments/create-comments/create-comments.component';
import { ListCommentsComponent } from './board/comments/list-comments/list-comments.component';
import { CreateRoleComponent } from './admin/create-role/create-role.component';
import { ListRoleComponent } from './admin/list-role/list-role.component';
import { ListUserComponent } from './admin/list-user/list-user.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RegisterComponent,
    LoginComponent,
    UpdateUserComponent,
    ListBoardComponent,
    RegisterBoardComponent,
    ListTaskComponent,
    CreateTaskComponent,
    InviteUserComponent,
    CreateCommentsComponent,
    ListCommentsComponent,
    CreateRoleComponent,
    ListRoleComponent,
    ListUserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
