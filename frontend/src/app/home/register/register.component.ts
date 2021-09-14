import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerData: any;
  selectedFile: any;
  fileInput: any;
  userImg:any ='';

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _utilitiesServices: UtilitiesService,
    private _sanitizer: DomSanitizer,
  ) {
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
    } else {
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
          this._utilitiesServices.openSnackBarSuccesfull('Successfull user registration.');
          this.registerData = {};
        },
        (err) => {
          console.log(err.error);
          this._utilitiesServices.openSnackBarError(err.error);
        }
      );
    }
  }

  ngOnInit(): void {}

  uploadImg(event: any) {
    this.selectedFile = <File>event.target.files[0];
    this.userImg = this._sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.selectedFile));
  }
}
