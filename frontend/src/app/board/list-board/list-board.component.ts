import { Component, OnInit } from '@angular/core';
import { BoardService } from 'src/app/services/board.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { Router } from '@angular/router';
import {MatDialogModule, MatDialogConfig, MatDialog} from '@angular/material/dialog';
import { RegisterBoardComponent } from '../register-board/register-board.component';

@Component({
  selector: 'app-list-board',
  templateUrl: './list-board.component.html',
  styleUrls: ['./list-board.component.css']
})
export class ListBoardComponent implements OnInit {
  boardData: any;
  textFiltered: string = "";
  filteredBoards: any[] = [];

  constructor(private _boardService: BoardService, private _utilitiesServices: UtilitiesService, private _router: Router, private _matDialog: MatDialog) {
    this.boardData = {};
  }

  ngOnInit(): void {
    this._boardService.listBoard().subscribe(
      (res) => {
        this.boardData = res.board;
        this.filteredBoards = res.board;
      },
      (err) => {
        this._utilitiesServices.openSnackBarError(err.error);
      }
    );
  }

  filteredWords(){
    //console.log(this.textFiltered);
    this.filteredBoards = this.boardData.filter(
      (board: any) => board.name.toLocaleLowerCase()
      .includes(this.textFiltered.toLocaleLowerCase())
    );
    console.log(this.filteredBoards);
    
  }

  enterSprint(id: any):void {
    console.log(id);
    this._router.navigate([`sprints/${id}`]);
  }

  deleteBoard(board: any) {
    this._boardService.deleteBoard(board).subscribe(
      (res) => {
        let index = this.boardData.indexOf(board);
        if (index > -1) {
          this.boardData.splice(index, 1);
          this._utilitiesServices.openSnackBarSuccesfull("Board eliminado correctamente");
        }
      },
      (err) => {
        this._utilitiesServices.openSnackBarError(err.error);
      }
    );
  }

  onCreate(){
    const matDialog= new MatDialogConfig();
    matDialog.disableClose=true;
    matDialog.autoFocus=true;
    matDialog.width="50%";
    this._matDialog.open(RegisterBoardComponent, matDialog);
  }
}
