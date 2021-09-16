import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { SpringService } from '../../../services/spring.service';
import { CreateTaskComponent } from '../../task/create-task/create-task.component';
import { CreateSpringComponent } from '../create-spring/create-spring.component';
import swal from 'sweetalert2';
import { BoardService } from 'src/app/services/board.service';
import { UpdateSpringComponent } from '../update-spring/update-spring.component';

@Component({
  selector: 'app-list-spring',
  templateUrl: './list-spring.component.html',
  styleUrls: ['./list-spring.component.css'],
})
export class ListSpringComponent implements OnInit {
  show: boolean = true;
  springData: any;
  boardData: any;
  springId: any;
  boardId: any;
  message: string;

  constructor(
    private _springService: SpringService,
    private _router: Router,
    private _activeRoute: ActivatedRoute,
    private _matDialog: MatDialog,
    private _utilitiesService: UtilitiesService,
    private _boardService: BoardService
  ) {
    this.springData = {};
    this.boardData = {};
    this.springId = null;
    this.boardId = null;
    this.message = '';
  }

  ngOnInit(): void {
    this.chargeBoard();
    this._springService.listSprings.subscribe((res) => {
      let anyArray: any[] = res.spring
      for (const i in anyArray) {
        anyArray[i].sprintOptions = false;
      }
      this.springData = anyArray;
    });
  }

  ngOnChanges(entryId: string) {
    this.chargeSpring(entryId);
  }

  chargeBoard() {
    this._boardService
      .getBoardById(this._activeRoute.snapshot.params.boardId)
      .subscribe(
        (res) => {
          this.boardData = res.board;
          this._springService.updateListSprings(this.boardData._id);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  chargeSpring(springId: any) {
    this.springId = springId;
  }

  chargeBoardId(boardId: any) {
    this.boardId = boardId;
  }

  updateSprint(springId: any, boardId: any) {
    this._matDialog.open(UpdateSpringComponent, {
      data: { springId, boardId },
      autoFocus: true,
      panelClass: [''],
      width: '400px',
      height: '500px',
    });
    this.chargeSpring(springId);
    this.chargeBoardId(boardId);
  }

  saveSprint(boardId: any) {
    this._matDialog.open(CreateSpringComponent, {
      data: { boardId },
      autoFocus: true,
      panelClass: [''],
      width: '400px',
      height: '500px',
    });
    this.chargeBoardId(boardId);
  }

  change() {
    this.show = !this.show;
  }

  addTask(springId: string, boardId: string) {
    this._matDialog.open(CreateTaskComponent, {
      data: { springId, boardId },
      autoFocus: true,
      panelClass: [''],
      width: '400px',
      height: '400px',
    });
    this.chargeSpring(springId);
  }

  async deleteSprint() {
    let result = await swal.fire({
      title: '¿Esta seguro de que desea eliminar el sprint seleccionado?',
      text: '¡No serás capaz de revertir estos cambios!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Eliminalo!',
    });

    if (result.isConfirmed) {
      this._springService.deleteSpring(this.springId).subscribe();
      swal.fire('Proceso Exitoso', '¡Sprint eliminado con existo!', 'success');
      this._springService.updateListSprings(this.boardData._id);
    }
  }
}
