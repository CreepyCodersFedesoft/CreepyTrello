import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private env: string;

  constructor(private _http: HttpClient, private _router: Router) { 
    this.env = environment.APP_URL;
  }

  
  listRole() {
    return this._http.get<any>(this.env + 'role/listRole/');
  }

  registerRole(role: any) {
    return this._http.post<any>(this.env + 'role/createRole/', role);
  }

  updateRole(role: any) {
    return this._http.post<any>(this.env + 'role/updateRole/', role);
  }  

  getDescription(role: string) {
    return this._http.get<any>(this.env + 'role/getDescription/' + role);
  } 

}
