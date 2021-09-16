import { Component, Input, OnInit } from '@angular/core';
import { TaskService } from '../../../services/task.service';
import { UtilitiesService } from '../../../services/utilities.service';
import {
  CdkDragDrop,
  CdkDragEnd,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import {
  MatDialogModule,
  MatDialogConfig,
  MatDialog,
} from '@angular/material/dialog';
import { CreateTaskComponent } from '../create-task/create-task.component';
import { TaskDetailsComponent} from "../task-details/task-details.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-task',
  templateUrl: './list-task.component.html',
  styleUrls: ['./list-task.component.css'],
})
export class ListTaskComponent implements OnInit{
  @Input() springId: any = null;
  @Input() boardId: any = null;

  taskData: any[];
  taskData1: string[] = [];
  taskData2: any[] = [];
  taskData3: any[] = [];
  message: string = '';
  commentInput = '';
  open = false;

  constructor(
    private _taskService: TaskService,
    private _utilitiesService: UtilitiesService,
    private _matDialog: MatDialog,
    private _router: Router
  ) {
    this.taskData = [];
    this.taskData2 = [];
    this.taskData3 = [];
  }
  
  ngOnInit(): void {
    this._taskService.listTasks.subscribe(
      (res) => {
        this.taskData = res
      },
      (err) => {
        this._utilitiesService.openSnackBarError(err.msg);
      }
    );
  }

  ngOnChanges(): void {
    this._taskService.updateListTask(this.springId); 
  }

  updateTask(task: any, status: string) {    
    let tempStatus = task.taskStatus;
    task.taskStatus = status;
    this._taskService.updateTask(task).subscribe(
      (res) => {
        task.status = status;
      },
      (err) => {
        task.status = tempStatus;
        this.message = err.error;
        this._utilitiesService.openSnackBarError(this.message);
      }
    );
  }

  deleteTask(task: any) {
    this._taskService.deleteTask(task).subscribe(
      (res) => {
        let index = this.taskData.indexOf(task);
        if (index > -1) {
          this.taskData.splice(index, 1);
          this.message = res.message;

          console.log('la tas tiene' + task);
        }
      },
      (err) => {
        this.message = err.error;
        this._utilitiesService.openSnackBarError(this.message);
      }
    );
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      //Dentro del mismo contenedor
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      //Fuera del contenedor
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  onCreate() {
    const matDialog = new MatDialogConfig();
    matDialog.disableClose = false;
    matDialog.autoFocus = true;
    matDialog.width = '50%';
    this._matDialog.open(CreateTaskComponent, matDialog);
  }

  onOpenComment() {
    this.open = !this.open;
  }

  addComment() {
    this.commentInput = 'comentario';
  }

  showDetails() {
    
    const matDialog = new MatDialogConfig();
    matDialog.disableClose = false;
    matDialog.autoFocus = true;
    matDialog.width = '90%';
    matDialog.height = '90%';
    this._matDialog.open(TaskDetailsComponent, matDialog);
  }
}
