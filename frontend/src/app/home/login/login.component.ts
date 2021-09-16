import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginData: any;
  message: string = '';

  
  constructor(
    private _userService: UserService,
    private _router: Router,
    private _utilitiesServices:UtilitiesService    
  ) { 
    this.loginData = {};    
  }

  ngOnInit(): void {
  }

  login() {
    if (!this.loginData.email || !this.loginData.password) {
      this._utilitiesServices.openSnackBarError('Failed process: Incomplete data.');
      this.loginData = {};
    } else {
      this._userService.login(this.loginData).subscribe(
        (res) => {
          localStorage.setItem('token', res.jwtToken);
          this._router.navigate(['/listBoard']);
          this.getRole(this.loginData.email);
          this.loginData = {};
          this._userService.changeDataUser(true);
        },
        (err) => {
          this._utilitiesServices.openSnackBarError(err.error);
        }
      );
    }
  }

  getRole(email: string) {
    this._userService.getRole(email).subscribe(
      (res) => {
        localStorage.setItem('role', res.role);
      },
      (err) => {
        console.log(err);
      }
    );
  }

}