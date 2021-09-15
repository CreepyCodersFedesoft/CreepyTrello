import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpringService {
  env: string;

  private _listSprings: BehaviorSubject<any> = new BehaviorSubject([]);
  public readonly listSprings: Observable<any> = this._listSprings.asObservable();
  
  constructor(
    private _http: HttpClient
  ) { 
    this. env = environment.APP_URL;
  }

  updateListSprings(boardId: any) {    
    this._http.get<any>(this.env + 'spring/listSpring/' + boardId).subscribe(
      (res) => {
        this._listSprings.next(res);
      },
      (err) => {
        this._listSprings.next([]);
      }
    );
  }

  searchSpring(springId: any) {
    return this._http.get<any>(this.env + 'spring/searchSprint/' + springId);
  }

  createSpring(spring: any) {
    return this._http.post<any>(this.env + 'spring/createSpring', spring);
  }

  updateSpring(spring: any) {
    return this._http.put<any>(this.env + 'spring/updateSprint', spring);
  }

  deleteSpring(spring: any) {
    return this._http.delete<any>(this.env + 'spring/deleteSprint/' + spring);
  }
  
}
