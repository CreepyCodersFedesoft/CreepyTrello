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

  //friltros
  filterUnAssigned: boolean = false;
  searchActive: boolean = false;
  priorityFilterActive: boolean = false;
  priorityFilter: any = null;
  searchText: string = '';
  allDataFiltered: any[] = [];

  //datos de los estados
  allData: any[];
  taskData: any[];
  taskData2: any[];
  taskData3: any[];

  //varios
  taskData1: string[] = [];
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
        this.allData = res;
        this.allDataFiltered = res;
        this.chargeData();
      },
      (err) => {
        this._utilitiesService.openSnackBarError(err.msg);
      }
    );
  }

  onNewComment(task:any){
    task.countComments += 1;
  }

  chargeData(){
    this.taskData = [];
    this.taskData2 = [];
    this.taskData3 = [];

    this.allDataFiltered.forEach(tData => {
      tData.visibleComments = false;
      tData.visibleDescription = false;
      tData.visibleAssign = false;          
      
      if(this.filterUnAssigned && this.priorityFilterActive && this.priorityFilter != null){
        if(tData.taskStatus === 'to-do' && 
          tData.assignedUser == null &&
          tData.priority == this.priorityFilter
        ){
          this.taskData.push(tData);
        }
        if(tData.taskStatus === 'in-progress' && 
          tData.assignedUser == null &&
          tData.priority == this.priorityFilter
        ){
          this.taskData2.push(tData);
        }
        if(tData.taskStatus === 'done' && 
          tData.assignedUser == null &&
          tData.priority == this.priorityFilter
        ){
          this.taskData3.push(tData);
        }  
      } else if(this.filterUnAssigned){
        if(tData.taskStatus === 'to-do' && tData.assignedUser == null){
          this.taskData.push(tData);
        }
        if(tData.taskStatus === 'in-progress' && tData.assignedUser == null){
          this.taskData2.push(tData);
        }
        if(tData.taskStatus === 'done' && tData.assignedUser == null){
          this.taskData3.push(tData);
        }  
      } else if (this.priorityFilterActive && this.priorityFilter != null) {
        if(tData.taskStatus === 'to-do' && 
          tData.priority == this.priorityFilter
        ){
          this.taskData.push(tData);
        }
        if(tData.taskStatus === 'in-progress' && 
          tData.priority == this.priorityFilter
        ){
          this.taskData2.push(tData);
        }
        if(tData.taskStatus === 'done' && 
          tData.priority == this.priorityFilter
        ){
          this.taskData3.push(tData);
        }  
      } else {
        if(tData.taskStatus === 'to-do'){
          this.taskData.push(tData);
        }
        if(tData.taskStatus === 'in-progress'){
          this.taskData2.push(tData);
        }
        if(tData.taskStatus === 'done'){
          this.taskData3.push(tData);
        }
      }      
    });
  }

  priorityFilterFuncion(prioritySelected: any){
    this.priorityFilter = prioritySelected;
    this.chargeData();
  }

  filterUnAssignedFunction(){
    this.filterUnAssigned = !this.filterUnAssigned;
    this.chargeData();
  }

  changeHigh(priority: any){
    return priority == 3 ? true: false;
  }

  changeMedium(priority: any){
    return priority == 2 ? true: false;
  }

  changeLow(priority: any){
    return priority == 1 ? true: false;
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
    
    this.updateTask(event.item.data, event.container.id);
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

  filteredWords() {
    this.allDataFiltered = this.allData.filter(
      (tData) =>
        tData.title
          .toLocaleLowerCase()
          .includes(this.searchText.toLocaleLowerCase()) ||
        tData.description
          .toLocaleLowerCase()
          .includes(this.searchText.toLocaleLowerCase())
    );
    this.chargeData();    
  }
}
