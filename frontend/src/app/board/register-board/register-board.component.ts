import { Component, OnInit } from '@angular/core';
import { BoardService } from "../../services/board.service";
import { Router } from '@angular/router';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-register-board',
  templateUrl: './register-board.component.html',
  styleUrls: ['./register-board.component.css']
})
export class RegisterBoardComponent implements OnInit {
  registerBoard: any;
  selectedFile: any;
  boardImg:any ='';
  constructor(
    private _boardService: BoardService,
    private _router: Router,
    private _utilitiesServices:UtilitiesService,
    private _sanitizer: DomSanitizer,
  ) {
    this.registerBoard = {};
    this.selectedFile = "";
  }

  ngOnInit(): void {
  }

  createBoard(){
    if(!this.registerBoard.name || !this.registerBoard.description){
      this._utilitiesServices.openSnackBarError('Fallo el proceso: Datos icompletos')
      this.registerBoard = {};
    }else{
      const data = new FormData();
      if(this.selectedFile !=null){
        data.append('image', this.selectedFile, this.selectedFile.name);
      }
      data.append('name', this.registerBoard.name)
      data.append('description', this.registerBoard.description)


      this._boardService.createBoard(data).subscribe(
        (res)=>{
          this._router.navigate(['/listBoard']);
          this._utilitiesServices.openSnackBarSuccesfull('Tablero Creado');
          this.registerBoard = {};
        }
      )
    }
  }

  uploadImg(event:any){
    this.selectedFile = <File> event.target.files[0]; 
    this.boardImg = this._sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.selectedFile));
  }
}
