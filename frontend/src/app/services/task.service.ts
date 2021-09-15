import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private env: string;

  constructor(private _http: HttpClient) {
    this.env = environment.APP_URL;
   }
   createTask(task: any) {
    return this._http.post<any>(this.env + 'task/createTask', task);
  }
  listTask(springId: any) {
    return this._http.get<any>(this.env + 'task/listTask/' + springId);
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
