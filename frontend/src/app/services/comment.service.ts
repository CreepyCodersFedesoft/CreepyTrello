import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  env: string;

  constructor(
    private _http: HttpClient,
    private _router: Router,
  ) { 
    this. env = environment.APP_URL;
  }

  listComment(comment: any) {
    return this._http.get<any>(this.env + 'comment/listComment', comment);
  }
  createComment(comment: any) {
    return this._http.post<any>(this.env + 'comment/createComment', comment);
  }
}
