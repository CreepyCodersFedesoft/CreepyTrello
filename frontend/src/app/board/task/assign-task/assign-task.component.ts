import { Component, Input, OnInit } from '@angular/core';
import { BoardService } from 'src/app/services/board.service';
import { TaskService } from 'src/app/services/task.service';
import { UserService } from 'src/app/services/user.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-assign-task',
  templateUrl: './assign-task.component.html',
  styleUrls: ['./assign-task.component.css']
})
export class AssignTaskComponent implements OnInit {
  @Input() taskId: string = "";
  @Input() boardId: string = "";
  @Input() assignedUser: any = '';
  seletedUser: any;
  usersData: any[];
  userAssigned: any;

  constructor(
    private _boardService: BoardService,
    private _taskService: TaskService,
    private _utilitiesService: UtilitiesService,
    private _userService: UserService,
  ) {
    this.usersData = [];
    this.seletedUser = {};
    this.userAssigned = {};
  }

  ngOnInit(): void {
    this._boardService.getUsersOnBoard(this.boardId).subscribe(
      (res) => {
        this.usersData = res.filteredList;
        //console.log('assignedUser ->' + this.assignedUser);
        if (this.assignedUser != null) {
          this._userService.getNameAndImage(this.assignedUser).subscribe(
            (resUser) => {
              this.userAssigned = resUser.userData.name;
            },
            (errUser) => {
              console.log(errUser);
            }
          )
        }
        //this.seletedUser = this.assignedUser;
      },
      (err) => {
        this._utilitiesService.openSnackBarError('No se han encontrado usuarios invitados al Board');
      }
    );
  }


  assignTask() {
    console.log('assignedUser ->' + this.assignedUser);
    
    this.seletedUser = {
      assignedUser: this.seletedUser.assignedUser,
      _id: this.taskId,
    }
    this._taskService.assignUser(this.seletedUser).subscribe(
      (res) => {
        this._utilitiesService.openSnackBarSuccesfull('¡Tarea asignada con exito!');
      },
      (err) => {
        this._utilitiesService.openSnackBarError('No has seleccionado un usuario');
      }
    );
  }

}
