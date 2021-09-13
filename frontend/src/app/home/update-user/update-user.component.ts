import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { UtilitiesService } from 'src/app/services/utilities.service';
@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {
  updateData: any;
  selectedFile: any;

  constructor(
    private _userService: UserService,
    private _sanitizer: DomSanitizer,
    private _utilitiesServices:UtilitiesService
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
    this.updateData.userImg = this._sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.selectedFile));
  }

  UpdateUser(){
    if (
      !this.updateData.name ||
      !this.updateData.email
    ) {
      this._utilitiesServices.openSnackBarError('Failed process: Imcomplete data')
      this.updateData = {};      
    } else {
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
          this._utilitiesServices.openSnackBarSuccesfull("Usuario Actualizado correctamente")
          //this.chargeData();
          this._userService.changeDataUser(true);
        },
        (err) => {
          this._utilitiesServices.openSnackBarError(err.error)
        }
      );      
    }
  }
}
