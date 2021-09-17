import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { UserService } from './services/user.service';
import { RoleService } from './services/role.service';
import { BoardService } from './services/board.service';
import { TaskService } from './services/task.service';
import { CommentService } from './services/comment.service';
import { UtilitiesService } from './services/utilities.service';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { AuthGuard } from './guard/auth.guard';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatGridListModule} from '@angular/material/grid-list';

import { HeaderComponent } from './home/header/header.component';
import { RegisterComponent } from './home/register/register.component';
import { LoginComponent } from './home/login/login.component';
import { UpdateUserComponent } from './home/update-user/update-user.component';
import { ListBoardComponent } from './board/list-board/list-board.component';
import { RegisterBoardComponent } from './board/register-board/register-board.component';
import { ListTaskComponent } from './board/task/list-task/list-task.component';
import { CreateTaskComponent } from './board/task/create-task/create-task.component';
import { CreateCommentsComponent } from './board/comments/create-comments/create-comments.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ListCommentsComponent } from './board/comments/list-comments/list-comments.component';
import { CreateRoleComponent } from './admin/create-role/create-role.component';
import { ListRoleComponent } from './admin/list-role/list-role.component';
import { ListUserComponent } from './admin/list-user/list-user.component';
import { ListSprintComponent } from './board/sprint/list-sprint/list-sprint.component';
import { CreateSprintComponent } from './board/sprint/create-sprint/create-sprint.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UpdateSprintComponent } from './board/sprint/update-sprint/update-sprint.component';
import { TaskDetailsComponent } from './board/task/task-details/task-details.component';
import { InviteUserBoardComponent } from './board/invite-user-board/invite-user-board.component';
import { AssignTaskComponent } from './board/task/assign-task/assign-task.component';


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
    CreateCommentsComponent,
    ListCommentsComponent,
    CreateRoleComponent,
    ListRoleComponent,
    ListUserComponent,
    ListSprintComponent,
    CreateSprintComponent,
    UpdateSprintComponent,
    TaskDetailsComponent,
    InviteUserBoardComponent,
    AssignTaskComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatIconModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSidenavModule,
    MaterialFileInputModule,
    DragDropModule,
    MatDialogModule,
    MatMenuModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatTooltipModule,
    MatGridListModule,
  ],
  providers: [
    UserService,
    RoleService,
    BoardService,
    TokenInterceptorService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
    TaskService,
    CommentService,
    UtilitiesService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
