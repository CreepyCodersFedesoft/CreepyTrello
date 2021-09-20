import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {
  message: string = '';
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  durationInSeconds: number = 2;
  constructor(private _snackBar: MatSnackBar) { }

  openSnackBarSuccesfull(text:string) {
    this.message = text;
    this._snackBar.open(this.message, 'X', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: this.durationInSeconds * 1000,
      panelClass: ['style-snackBarTrue'],
    });
  }

  openSnackBarError(text:string) {
    this.message = text;
    this._snackBar.open(this.message, 'X', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: this.durationInSeconds * 1000,
      panelClass: ['style-snackBarFalse'],
    });
  }

  /*
        '¿Esta seguro de que desea eliminar el sprint seleccionado?',
      '¡No serás capaz de revertir estos cambios!',
      '¡Si, Eliminalo!',
      'warning'
  */
  async SweetAlertConfirmation(
    title: string, 
    text: string, 
    confirmButtonText: string,
    icon: any,
    ) {
    let result = await swal.fire({
      title: title,
      text: text,
      icon: icon,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: confirmButtonText,
    });
    return result;
  }

  SweetAlert(title: string, text: string ,icon: any){
    swal.fire(title, text, icon);
  }
}
