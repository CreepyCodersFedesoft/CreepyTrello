import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.component.html',
  styleUrls: ['./create-role.component.css'],
})
export class CreateRoleComponent implements OnInit {
  loginData: any;
  message: string = '';

  constructor(private _utilitiesServices: UtilitiesService) {
    this.loginData = {};
  }

  ngOnInit(): void {}

  login() {
    if (!this.loginData.email || !this.loginData.password) {
      this._utilitiesServices.openSnackBarError(
        'Failed process: Incomplete data.'
      );
      this.loginData = {};
    } else {
      /*this._userService.login(this.loginData).subscribe(
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
      );*/
    }
  }
}
