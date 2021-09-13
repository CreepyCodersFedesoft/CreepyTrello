import { Component, OnInit } from '@angular/core';
import { BoardService } from "../../services/board.service";
import { Router } from '@angular/router';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-register-board',
  templateUrl: './register-board.component.html',
  styleUrls: ['./register-board.component.css']
})
export class RegisterBoardComponent implements OnInit {
  registerBoard: any;
  message: string = '';
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  durationInSeconds: number = 2;
  constructor(
    private _boardService: BoardService,
    private _router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.registerBoard = {};
  }

  ngOnInit(): void {
  }

  createBoard(){
    if(!this.registerBoard.name || !this.registerBoard.description){
      this.message = 'Fallo el proceso: Datos icompletos';
      this.openSnackBarError();
      this.registerBoard = {};
    }else{
      this._boardService.createBoard(this.registerBoard).subscribe(
        (res)=>{
          this._router.navigate(['/listBoard']);
          this.message = 'Tablero Creado';
          this.openSnackBarSuccesfull();
          this.registerBoard = {};
        }
      )
    }
  }

  openSnackBarSuccesfull(){
    this._snackBar.open(this.message, 'X', {
      horizontalPosition:this.horizontalPosition,
      verticalPosition:this.verticalPosition,
      duration: this.durationInSeconds *1000,
      panelClass: ['style-snackBarTrue'],
    });
  }

  openSnackBarError(){
    this._snackBar.open(this.message, 'X', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: this.durationInSeconds * 1000,
      panelClass: ['style-snackBarFalse']
    });
  }
}
