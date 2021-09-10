import { Component, OnInit } from '@angular/core';
import { BoardService } from 'src/app/services/board.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-board',
  templateUrl: './list-board.component.html',
  styleUrls: ['./list-board.component.css']
})
export class ListBoardComponent implements OnInit {
  boardData: any;

  constructor(private _boardService: BoardService, private _utilitiesServices: UtilitiesService, private _router: Router) {
    this.boardData = {};
  }

  ngOnInit(): void {
    this._boardService.listBoard().subscribe(
      (res) => {
        console.log(res.board);
        this.boardData = res.board;
      },
      (err) => {
        this._utilitiesServices.openSnackBarError(err.error);
      }
    );
  }

  doStuff(id: any):void {
    console.log(id);
    this._router.navigate(['/login']);
  }
}
