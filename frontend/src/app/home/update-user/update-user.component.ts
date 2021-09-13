import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {
  message: string = '';
  updateData: any;
  selectedFile: any;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  durationInSeconds: number = 5;
  pimage: string = '';

  constructor(
    private _userService: UserService,
    private _matSnackBar: MatSnackBar,
    private _router: Router,
  ) { 
    this.updateData = {};
    this.selectedFile = null;
  }

  ngOnInit(): void {
    this.chargeData();
  }

  chargeData() {
    this._userService.getEmail().subscribe(
      (res) => {

        this.updateData.name = res.name;
        this.updateData.email = res.email;
        this.updateData.userImg = res.userImg;
        this.updateData.password = '';
      },
      (err) => {
        console.log(err);
      }
    );
  }

  uploadImg(event: any){  
    this.selectedFile = <File>event.target.files[0];
  }

  UpdateUser(){
    if (
      !this.updateData.name ||
      !this.updateData.email
    ) {
      this.message = 'Failed process: Imcomplete data';
      this.openSnackBarError();
      this.updateData = {};      
    } else {
      console.log(this.updateData);
      const data = new FormData();
      if(this.selectedFile != null) {           
        data.append('image', this.selectedFile, this.selectedFile.name);        
      } 
      if(this.updateData.password != '') {
        data.append('password', this.updateData.password);
      } 
      data.append('name', this.updateData.name);
      data.append('email', this.updateData.email);

      this._userService.updateUser(data).subscribe(
        (res) => {
          this.message = 'Usuario Actualizado correctamente';
          this.openSnackBarSuccess();
          this.chargeData();
          this._userService.changeDataUser(true);
        },
        (err) => {
          this.message = err.error;
          this.openSnackBarError();
        }
      );      
    }
  }

  openSnackBarSuccess() {
    this._matSnackBar.open(this.message, 'X', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: this.durationInSeconds *1000,
      panelClass: ['style-snackBarTrue'],
    });
  }
  openSnackBarError() {
    this._matSnackBar.open(this.message, 'X', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: this.durationInSeconds * 1000,
      panelClass: ['style-snackBarTrue'],
    });
  }
}
