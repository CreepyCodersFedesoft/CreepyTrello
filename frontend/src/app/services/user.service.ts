import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  env: string;
  constructor(
    private _http: HttpClient,
    private _router: Router,
  ) { 
    this. env = environment.APP_URL;
  }
  getEmail() {
    return this._http.get<any>(this.env + 'user/getEmail');
  }
  updateUser(user: any) {
    return this._http.put<any>(this.env + 'user/updateUser', user);
  } 
  

  //otras rutas
  loggedIn() {
    return !!localStorage.getItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isAdmin() {
    return localStorage.getItem('role') === 'admin' ? true : false;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this._router.navigate(['/login']);
  }
}
