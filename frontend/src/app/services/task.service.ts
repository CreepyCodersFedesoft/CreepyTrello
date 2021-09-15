import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private env: string;

  private _listTasks: BehaviorSubject<any> = new BehaviorSubject([]);
  public readonly listTasks: Observable<any> = this._listTasks.asObservable();

  constructor(private _http: HttpClient) {
    this.env = environment.APP_URL;
  }

  updateListTask(springId: any) {    
    this._http.get<any>(this.env + 'task/listTask/' + springId).subscribe(
      (res) => {
        this._listTasks.next(res.task);
      },
      (err) => {
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

  deleteTask(task: any) {
    return this._http.delete<any>(this.env + 'task/deleteTask/' + task._id);
  }

  findTask(_id: string) {
    return this._http.get<any>(this.env + 'user/findTask/' + _id);
  }
}
