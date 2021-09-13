import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private env: string;
  constructor(private _http:HttpClient) { 
    this.env = environment.APP_URL;
  }

  createBoard(board: any){
    return this._http.post<any>(this.env + 'board/createBoard', board);
  }

  listBoard(){
    return this._http.get<any>(this.env + 'board/listBoard');
  }
}
