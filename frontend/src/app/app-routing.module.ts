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
import { TaskDetailsComponent } from './board/task/task-details/task-details.component';
import { InviteUserBoardComponent } from './board/invite-user-board/invite-user-board.component';
import { LogTaskComponent } from './board/task/log-task/log-task.component';
import { AuthGuard } from './guard/auth.guard';
import { UpdateTaskComponent } from './board/task/update-task/update-task.component';

const routes: Routes = [
  {
    path: '',
    component: ListBoardComponent,
    canActivate: [AuthGuard],
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
    canActivate: [AuthGuard],
  },
  {
    path: 'listBoard',
    component: ListBoardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'inviteUserBoard',
    component: InviteUserBoardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'registerBoard',
    component: RegisterBoardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'listTask',
    component: ListTaskComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'createTask',
    component: CreateTaskComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'listComments',
    component: ListCommentsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'createComment',
    component: CreateCommentsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'createRole',
    component: CreateRoleComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'listRole',
    component: ListRoleComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'listUser',
    component: ListUserComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'sprints/:boardId',
    component: ListSprintComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'createSprint',
    component: CreateSprintComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'listTask/:_id',
    component: TaskDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'listLogTask',
    component: LogTaskComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
