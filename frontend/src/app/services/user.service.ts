import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  env: string;
  
  private messageSource = new BehaviorSubject(true);
  isChanged = this.messageSource.asObservable();

  constructor(
    private _http: HttpClient,
    private _router: Router,
  ) { 
    this. env = environment.APP_URL;
  }

  changeDataUser(message: boolean) {
    this.messageSource.next(message)
  }

  getAllUser(){
    return this._http.get<any>(this.env + 'user/listUserAll');
  }
  
  getEmail() {
    return this._http.get<any>(this.env + 'user/getEmail');
  }
  updateUser(user: any) {
    return this._http.put<any>(this.env + 'user/updateUser', user);
  } 

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isAdmin() {
    return localStorage.getItem('role') === 'admin' ? true : false;
  }

  createUser(user: any) {
    console.log(user);
    return this._http.post<any>(this.env + 'user/createUser', user);
  }

  login(user: any) {
    return this._http.post<any>(this.env + 'user/login', user);
  }

  getRole(email: string) {
    return this._http.get<any>(this.env + 'user/getRole/' + email);
  }  
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this._router.navigate(['/login']);
  }
}
