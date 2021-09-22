import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilitiesService } from '../../../services/utilities.service';
import { TaskService } from '../../../services/task.service';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'app-log-task',
  templateUrl: './log-task.component.html',
  styleUrls: ['./log-task.component.css'],
})
export class LogTaskComponent implements OnInit {
  @Input() taskId: string = '';
  logData: any;
  displayedColumns: string[] = ['Fecha', 'Nombre', 'Accion'];
  registerData: any;
  message: string = '';
  _id: string;
  taskData: any[];
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
    this.taskData = [];
  }

  ngOnInit(): void {
    this.listLog();
  }

  listLog() {
    this._taskService.listLogTask(this.taskId).subscribe(
      (res) => {
        console.log(res);
        this.logData = res.history;
        console.log(this.logData);
      },
      (err) => {
        this._utilitiesService.openSnackBarError(
          'No se han encontrado logs para esta tarea'
        );
      }
    );
  }

  list(){
    this._Arouter.params.subscribe((params) => {
      this._id = params['_id'];
      this._taskService.findTask(this._id).subscribe(
        (res) => {
          this.registerData = res.task;
          console.log(this.registerData);
          
        },
        (err) => {
          this.message = err.error;
          this._utilitiesService.openSnackBarError(this.message);
        }
      );
    });
  }
}
