import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpringService {
  env: string;
  constructor(
    private _http: HttpClient
  ) { 
    this. env = environment.APP_URL;
  }
  listSpring(boardId: any) {
    return this._http.get<any>(this.env + 'spring/listSpring/' + boardId);
  }
  createSpring(spring: any) {
    return this._http.post<any>(this.env + 'spring/createSpring', spring);
  } 
  updateSpring(spring: any) {
    return this._http.put<any>(this.env + 'spring/updateSpring', spring);
  } 
}
