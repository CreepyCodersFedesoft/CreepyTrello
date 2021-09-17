import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateRoleComponent } from './admin/create-role/create-role.component';
import { ListRoleComponent } from './admin/list-role/list-role.component';
import { ListUserComponent } from './admin/list-user/list-user.component';
import { CreateCommentsComponent } from './board/comments/create-comments/create-comments.component';
import { ListCommentsComponent } from './board/comments/list-comments/list-comments.component';
import { ListBoardComponent } from './board/list-board/list-board.component';
import { RegisterBoardComponent } from './board/register-board/register-board.component';
import { CreateSprintComponent } from './board/sprint/create-sprint/create-sprint.component';
import { ListSprintComponent } from './board/sprint/list-sprint/list-sprint.component';
import { CreateTaskComponent } from './board/task/create-task/create-task.component';
import { ListTaskComponent } from './board/task/list-task/list-task.component';
import { LoginComponent } from './home/login/login.component';
import { RegisterComponent } from './home/register/register.component';
import { UpdateUserComponent } from './home/update-user/update-user.component';
import { TaskDetailsComponent } from "./board/task/task-details/task-details.component";
import { InviteUserBoardComponent } from './board/invite-user-board/invite-user-board.component';



const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    pathMatch: 'full',
  },
  {
    path: 'register',
    component: RegisterComponent,
    pathMatch: 'full',
  },
  {
    path: 'updateUser',
    component: UpdateUserComponent,
    pathMatch: 'full',
  },
  {
    path: 'listBoard',
    component: ListBoardComponent,
    pathMatch: 'full',
  },
  {
    path: 'inviteUserBoard',
    component: InviteUserBoardComponent,
    pathMatch: 'full',
  },
  {
    path: 'registerBoard',
    component: RegisterBoardComponent,
    pathMatch: 'full',
  },
  {
    path: 'listTask',
    component: ListTaskComponent,
    pathMatch: 'full',
  },
  {
    path: 'createTask',
    component: CreateTaskComponent,
    pathMatch: 'full',
  },
  {
    path: 'listComments',
    component: ListCommentsComponent,
    pathMatch: 'full',
  },
  {
    path: 'createComment',
    component: CreateCommentsComponent,
    pathMatch: 'full',
  },
  {
    path: 'createRole',
    component: CreateRoleComponent,
    pathMatch: 'full',
  },
  {
    path: 'listRole',
    component: ListRoleComponent,
    pathMatch: 'full',
  },
  {
    path: 'listUser',
    component: ListUserComponent,
    pathMatch: 'full',
  },
  {
    path: 'sprints/:boardId',
    component: ListSprintComponent,
    pathMatch: 'full',
  },
  {
    path: 'createSprint',
    component: CreateSprintComponent,
    pathMatch: 'full',
  },

  {
    path: 'listTask/:_id',
    component: TaskDetailsComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
