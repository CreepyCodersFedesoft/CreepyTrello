import { Component, ElementRef, Input, OnInit } from '@angular/core';
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
  @Input() sprintId: any = null;
  @Input() boardId: any = null;

  taskData1: string[] = [];
  allData: any[];
  taskData: any[];
  taskData2: any[];
  taskData3: any[];
  message: string = '';
  commentInput = '';
  open = false;

  constructor(
    private _taskService: TaskService,
    private _utilitiesService: UtilitiesService,
    private _matDialog: MatDialog,
    private _router: Router,
  ) {
    this.allData = [];
    this.taskData = [];
    this.taskData2 = [];
    this.taskData3 = [];
  }
  
  ngOnInit(): void {
    this._taskService.listTasks.subscribe(
      (res) => {
        this.taskData = [];
        this.taskData2 = [];
        this.taskData3 = [];

        this.allData = res
        this.allData.forEach(tData => {
          tData.visibleComments = false;
          tData.visibleDescription = false;
          tData.visibleAssign = false;          
          
          if(tData.taskStatus === 'to-do'){
            this.taskData.push(tData);
          }
          if(tData.taskStatus === 'in-progress'){
            this.taskData2.push(tData);
          }
          if(tData.taskStatus === 'done'){
            this.taskData3.push(tData);
          }                    
          
        });
      },
      (err) => {
        this._utilitiesService.openSnackBarError(err.msg);
      }
    );
  }

  ngOnChanges(): void {
    this._taskService.updateListTask(this.sprintId); 
  }

  updateTask(task: any, status: string) {   
    
    let tempStatus = task.taskStatus;
    task.taskStatus = status;

    const data = new FormData();
    
    data.append('_id', task._id);
    data.append('title', task.title);
    data.append('description', task.description);
    data.append('taskStatus', task.taskStatus);
    data.append('priority', task.priority);
    data.append('sprintId', task.sprintId);

    this._taskService.updateTask(data).subscribe(
      (res) => {
        //console.log('Tarea cambiada de estado correctamente');
      },
      (err) => {
        console.log(err);
        
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

          console.log('la task tiene' + task);
        }
      },
      (err) => {
        this.message = err.error;
        this._utilitiesService.openSnackBarError(this.message);
      }
    );
  }

  drop(event: CdkDragDrop<any[]>) {
    //console.log(event);
    //console.log(event.item.data, 'status: '+ event.container.id);
    

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
    
    //actualizamos el estado de la tarea
    this.updateTask(event.item.data, event.container.id);

    //console.log(event.item.data, 'status: '+ event.container.id);
    /*
    aqui se deben actualizar la listas
    console.log('this.taskData ->', this.taskData);
    console.log('this.taskData2 ->', this.taskData2);
    console.log('this.taskData2 ->', this.taskData3);
    */
  }

  onCreate() {
    const matDialog = new MatDialogConfig();
    matDialog.disableClose = false;
    matDialog.autoFocus = true;
    matDialog.width = '400px';
    this._matDialog.open(CreateTaskComponent, matDialog);
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
