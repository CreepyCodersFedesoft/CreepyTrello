import { Component, OnInit } from '@angular/core';
import { TaskService } from "../../../services/task.service";
import { UtilitiesService } from "../../../services/utilities.service";
import {CdkDragDrop, CdkDragEnd, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-list-task',
  templateUrl: './list-task.component.html',
  styleUrls: ['./list-task.component.css']
})
export class ListTaskComponent implements OnInit {
  todo: string[] = ["Hacer comida", "jugar", "salir hacer deporte", "dormir"]
  progress: string[]=[];
  done: string[]=[];
  tarea = '';
  done2: string[]=[];
  nombres: any[];

  taskData: any[];
  taskData1: string[]=[];
  taskData2: any[]=[];
  taskData3: any[]=[];
  message: string = '';

  constructor(private _taskService: TaskService, private _utilitiesService: UtilitiesService ) { 
    this.taskData = [];
    this.taskData2 = [];
    this.taskData3 = [];
    this.done2 = [];
    this.nombres = [];
  }

  ngOnInit(): void {
    this._taskService.listTask().subscribe(
      (res) => {
        this.taskData = res.task;
        console.log(res.Task); 
      },
      (err) => {
        this.message = err.error;
        
      }
      
    );
    const nombres= JSON.stringify(this.taskData, ['name']);
        console.log("los valores son" + nombres)
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
        this._utilitiesService.openSnackBarError(this.message)
        
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
         
          console.log("la tas tiene" + task);
          
        }
      },
      (err) => {
        this.message = err.error;
        this._utilitiesService.openSnackBarError(this.message)
       
      }
    );
  }
  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) { //Dentro del mismo contenedor
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else { //Fuera del contenedor
      transferArrayItem(event.previousContainer.data, 
                        event.container.data, 
                        event.previousIndex, 
                        event.currentIndex);
    }
  }

}
