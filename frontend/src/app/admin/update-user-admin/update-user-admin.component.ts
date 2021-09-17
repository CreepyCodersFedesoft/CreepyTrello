import { Component, Inject, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { UtilitiesService } from '../../services/utilities.service';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-update-user-admin',
  templateUrl: './update-user-admin.component.html',
  styleUrls: ['./update-user-admin.component.css']
})
export class UpdateUserAdminComponent implements OnInit {
  @Input() userId: any = null;
  updateData: any;
  selectedFile: any;

  constructor(
    private _userService: UserService,
    private _utilitiesService: UtilitiesService,
    public _dialogRef: MatDialog,
    private _sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      userId: any;
    }
  ) {
    this.updateData = {};
  }
  uploadImg(event: any){    
    this.selectedFile = <File>event.target.files[0];
    this.updateData.userImg = this._sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.selectedFile));
  }

  ngOnInit(): void {
    this._userService.getUserById(this.data.userId).subscribe(
      (res) => {        
        this.updateData.name = res.user.name;
        this.updateData.email = res.user.email;
        this.updateData.userImg = res.user.userImg;
        this.updateData.password = '';
      },
      (err) => {
        this._utilitiesService.openSnackBarError(err.error);
      }
    );
  }

  updateUser(){
    if (
      !this.updateData.name ||
      !this.updateData.email
    ) {
      this._utilitiesService.openSnackBarError('Failed process: Imcomplete data')
      this.updateData = {};      
    } else {
      const data = new FormData();
      if(this.selectedFile != null) {           
        data.append('image', this.selectedFile, this.selectedFile.name);        
      } 
      if(this.updateData.password != '') {
        data.append('password', this.updateData.password);
      } 
      data.append('_id', this.data.userId);
      data.append('name', this.updateData.name);
      data.append('email', this.updateData.email);
      
      this._userService.updateUserAdmin(data).subscribe(
        (res) => {          
          this._utilitiesService.openSnackBarSuccesfull("Usuario Actualizado correctamente");
          this._userService.changeDataUser(true);
        },
        (err) => {
          this._utilitiesService.openSnackBarError(err.error)
        }
      );      
    }
  }
}
