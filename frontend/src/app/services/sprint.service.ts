import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SprintService {
  env: string;

  private _listSprints: BehaviorSubject<any> = new BehaviorSubject([]);
  public readonly listSprints: Observable<any> = this._listSprints.asObservable();
  
  constructor(
    private _http: HttpClient
  ) { 
    this. env = environment.APP_URL;
  }

  updateListSprints(boardId: any) {    
    this._http.get<any>(this.env + 'sprint/listSprint/' + boardId).subscribe(
      (res) => {
        this._listSprints.next(res);
      },
      (err) => {
        this._listSprints.next([]);
      }
    );
  }

  searchSprint(sprintId: any) {
    return this._http.get<any>(this.env + 'sprint/searchSprint/' + sprintId);
  }

  createSprint(sprint: any) {
    return this._http.post<any>(this.env + 'sprint/createSprint', sprint);
  }

  updateSprint(sprint: any) {
    return this._http.put<any>(this.env + 'sprint/updateSprint', sprint);
  }

  deleteSprint(sprint: any) {
    return this._http.delete<any>(this.env + 'sprint/deleteSprint/' + sprint);
  }
  
}
