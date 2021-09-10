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
  constructor() {
    this.registerBoard = {};
  }

  ngOnInit(): void {
  }

  saveTask(){
    if(!this.registerBoard.name || !this.registerBoard.description){

    }
  }

  openSnackBarError(){
    
  }
}
