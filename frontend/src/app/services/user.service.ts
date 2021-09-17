import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  env: string;
  
  private messageSource = new BehaviorSubject(true);
  isChanged = this.messageSource.asObservable();

  public _listUsers: BehaviorSubject<any> = new BehaviorSubject([]);
  public readonly listUsers: Observable<any> = this._listUsers.asObservable();

  constructor(
    private _http: HttpClient,
    private _router: Router,
  ) { 
    this. env = environment.APP_URL;
  }

  updateListTask() {    
    this._http.get<any>(this.env + 'user/listUserAll').subscribe(
      (res) => {
        this._listUsers.next(res.users);
      },
      (err) => {
        this._listUsers.next([]);        
      }
    );
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
  
  updateUserAdmin(user: any) {
    return this._http.put<any>(this.env + 'user/updateUserByAdmin', user);
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
  
  getUserById(id: String){
    return this._http.get<any>(this.env + 'user/getUserById/' + id);
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this._router.navigate(['/login']);
  }
  deleteUser(user: any){
    return this._http.put<any>(this.env + 'user/deleteUser', user);
  }
}
