import { Component, Input, OnInit } from '@angular/core';
import { BoardService } from 'src/app/services/board.service';
import { TaskService } from 'src/app/services/task.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-invite-user',
  templateUrl: './invite-user.component.html',
  styleUrls: ['./invite-user.component.css']
})
export class InviteUserComponent implements OnInit {
  @Input() taskId: string = "";
  @Input() boardId: string = "";
  seletedUser: any;

  usersData: any[];

  constructor(
    private _boardService: BoardService,
    private _taskService: TaskService,
    private _utilitiesService: UtilitiesService,
  ) {
    this.usersData = [];
    this.seletedUser = {}
  }

  ngOnInit(): void {
    this._boardService.getUsersOnBoard(this.boardId).subscribe(
      (res) => {
        this.usersData = res.filteredList;
        console.log(this.usersData);
      },
      (err) => {
        this._utilitiesService.openSnackBarError('No se han encontrado usuarios invitados al Board');
      }
    );
  }


  assignTask() {
    this.seletedUser = {
      assignedUser: this.seletedUser.assignedUser,
      _id: this.taskId,
    }
    this._taskService.assignUser(this.seletedUser).subscribe(
      (res) => {
        this._utilitiesService.openSnackBarSuccesfull('¡Tarea asignada con exito!');
      },
      (err) => {
        this._utilitiesService.openSnackBarError(err.error);
      }
    );
  }
}
