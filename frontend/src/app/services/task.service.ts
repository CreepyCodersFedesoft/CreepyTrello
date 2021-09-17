import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { UtilitiesService } from './utilities.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private env: string;

  public _listTasks: BehaviorSubject<any> = new BehaviorSubject([]);
  public readonly listTasks: Observable<any> = this._listTasks.asObservable();

  constructor(private _http: HttpClient, private _utilitiesService: UtilitiesService) {
    this.env = environment.APP_URL;
  }

  updateListTask(sprintId: any) {    
    this._http.get<any>(this.env + 'task/listTask/' + sprintId).subscribe(
      (res) => {
        this._listTasks.next(res.task);
      },
      (err) => {
        //this._utilitiesService.openSnackBarError(err.error.msg);
        this._listTasks.next([]);        
      }
    );
  }

  createTask(task: any) {
    return this._http.post<any>(this.env + 'task/createTask', task);
  }
  
  updateTask(task: any) {
    return this._http.put<any>(this.env + 'task/updateTask', task);
  }
  assignUser(task: any) {
    return this._http.put<any>(this.env + 'task/assignUser', task);
  }
  deleteTask(task: any) {
    return this._http.delete<any>(this.env + 'task/deleteTask/' + task._id);
  }

  findTask(_id: string) {
    return this._http.get<any>(this.env + 'task/findTask/' + _id);
  }
}
