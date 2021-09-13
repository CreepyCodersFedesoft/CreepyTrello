import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerData: any;
  selectedFile: any;
  fileInput: any;

  constructor(private _userService: UserService, private _router: Router) {
    this.registerData = {};
  }

  registerUser() {
    if (
      !this.registerData.name ||
      !this.registerData.email ||
      !this.registerData.password
    ) {
      this.registerData = {};
      this.selectedFile = null;
    }
    else {
      const data = new FormData();
      if (this.selectedFile != null) {
        data.append('image', this.selectedFile, this.selectedFile.name);
      }
      data.append('name', this.registerData.name);
      data.append('email', this.registerData.email);
      data.append('password', this.registerData.password);
      this._userService.createUser(data).subscribe(
        (res) => {
          this._router.navigate(['/createBoard']);
          /* this.message = 'Successfull user registration.';
          this.openSnackBarSuccesfull();*/
          this.registerData = {};

        },
        (err) => {
          console.log(err.error);
          /*this.message = err.error;
          this.openSnackBarError();*/
        }
      );
    }
  }

  ngOnInit(): void {

  }

  uploadImg(event: any) {
    this.selectedFile = <File>event.target.files[0];
  }
}
