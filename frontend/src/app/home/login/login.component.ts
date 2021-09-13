import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

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
  ) { 
    this.loginData = {};    
  }

  ngOnInit(): void {
  }

  login() {
    if (!this.loginData.email || !this.loginData.password) {
      this.message = 'Failed process: Imcomplete data';
      //this.openSnackBarError();
      this.loginData = {};
    } else {
      this._userService.login(this.loginData).subscribe(
        (res) => {
          localStorage.setItem('token', res.jwtToken);
          this._router.navigate(['/listTask']);
          this.getRole(this.loginData.email);
          this.loginData = {};
          this._userService.changeDataUser(true);
        },
        (err) => {
          this.message = err.error;
          //this.openSnackBarError();
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