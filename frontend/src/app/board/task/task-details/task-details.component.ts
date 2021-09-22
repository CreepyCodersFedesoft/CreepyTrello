import { Component, Input, OnInit } from '@angular/core';
import { TaskService } from '../../../services/task.service';
import { UserService } from 'src/app/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilitiesService } from '../../../services/utilities.service';

import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css'],
})
export class TaskDetailsComponent {
  @Input() sprintId: any = null;
  registerData: any;
  message: string = '';
  _id: string;
  name: any;
  user: any;
  userImg: any;
  taskImg: any;
  description: any;
  endDate: any;
  initDate: any;
  assignedImg: any;
  board: any;
  sprint: any;

  constructor(
    private _taskService: TaskService,
    private _utilitiesService: UtilitiesService,
    private _matDialog: MatDialog,
    private _router: Router,
    private _Arouter: ActivatedRoute,
    public _userService: UserService
  ) {
    this.registerData = {};
    this._id = '';
    this.name = '';
    this.user = '';
    this.userImg = '';
    this.taskImg = '';
    this.description = '';
    this.endDate = '';
    this.initDate = '';
    this.assignedImg = '';
    this.board = '';
    this.sprint = '';
  }

  ngOnInit(): void {
    this._Arouter.params.subscribe((params) => {
      this._id = params['_id'];
      this._taskService.findTask(this._id).subscribe(
        (res) => {
          this.registerData = res.task;
          console.log(this.registerData);

          this.registerData.assignedUser != null &&
          this.registerData.assignedUser.name != undefined
            ? (this.name = this.registerData.assignedUser.name)
            : (this.name = 'No hay usuario asignado');

          this.registerData.userId.name != undefined
            ? (this.user = this.registerData.userId.name)
            : (this.user = 'No hay usuario de creacion de tarea');
          this.registerData.description != undefined
            ? (this.description = this.registerData.description)
            : (this.description = 'No hay descripción para la tarea');

          this.registerData.userId.userImg != '' &&
          this.registerData.userId.userImg != undefined
            ? (this.userImg = this.registerData.userId.userImg)
            : (this.userImg = '../../../../assets/img/userExample.png');

          this.registerData.imgUrl != '' &&
          this.registerData.userId.userImg != undefined
            ? (this.taskImg = this.registerData.imgUrl)
            : (this.taskImg = '../../../../assets/img/no_task_img.PNG');

          this.registerData.date != undefined
            ? (this.initDate = this.registerData.date)
            : (this.initDate = 'No hay fecha de creación');

          this.registerData.sprintId.endDate != undefined
            ? (this.endDate = this.registerData.sprintId.endDate)
            : (this.endDate = 'No hay fecha de creación');

          this.registerData.sprintId.title != undefined
            ? (this.sprint = this.registerData.sprintId.title)
            : (this.sprint = 'La tarea no esta asignada a ningun sprint');

          this.registerData.sprintId.boardId.name != undefined
            ? (this.board = this.registerData.sprintId.boardId.name)
            : (this.board = 'La tarea no esta asignada a ningun sprint');
        },
        (err) => {
          this.message = err.error;
          this._utilitiesService.openSnackBarError(this.message);
        }
      );
    });
  }

  updateTask() {}
}
