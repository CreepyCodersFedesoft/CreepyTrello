import { Component, OnInit } from '@angular/core';
import { BoardService } from "../../services/board.service";

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

}
