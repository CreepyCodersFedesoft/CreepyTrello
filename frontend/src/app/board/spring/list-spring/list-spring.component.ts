import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { SpringService } from '../../../services/spring.service';
import { CreateTaskComponent } from '../../task/create-task/create-task.component';
import { CreateSpringComponent } from '../create-spring/create-spring.component';
import swal from 'sweetalert2';
import { BoardService } from 'src/app/services/board.service';

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
  message: string;

  constructor(
    private _springService: SpringService,
    private _router: Router,
    private _activeRoute: ActivatedRoute,
    private _matDialog: MatDialog,
    private _utilitiesService: UtilitiesService,
    private _boardService: BoardService,
  ) {
    this.springData = {};
    this.boardData = {};
    this.springId = null;
    this.message = '';
  }

  ngOnInit(): void {
    this.chargeBoard();
    this._springService.listSprings.subscribe(
      (res) => {
        this.springData = res
      }
    )
  }

  ngOnChanges(entryId: string) {
    this.chargeSpring(entryId);
  }

  chargeBoard(){
    this._boardService.getBoardById(this._activeRoute.snapshot.params.boardId).subscribe(
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

  onCreate() {
    const matDialog = new MatDialogConfig();
    matDialog.disableClose = false;
    matDialog.autoFocus = true;
    matDialog.width = '50%';
    let dialog = this._matDialog.open(CreateSpringComponent, matDialog);
    const sub = dialog.componentInstance.onAdd.subscribe((data) => {
      this.saveSprint(data);
      dialog.close()
    });
    dialog.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }

  saveSprint(registerData: any) {
    if (!registerData.title || !registerData.description) {
      this._utilitiesService.openSnackBarError('Datos incompletos');
    } else {
      registerData.boardId = this.boardData._id;
      this._springService.createSpring(registerData).subscribe(
        (res) => {
          this._springService.updateListSprings(this.boardData._id);
          this._utilitiesService.openSnackBarSuccesfull('Sprint creado');
        },
        (err) => {
          this._utilitiesService.openSnackBarError(err.error);
        }
      );
    }
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
