import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { SprintService } from '../../../services/sprint.service';
import { CreateTaskComponent } from '../../task/create-task/create-task.component';
import { CreateSprintComponent } from '../create-sprint/create-sprint.component';
import swal from 'sweetalert2';
import { BoardService } from 'src/app/services/board.service';
import { UpdateSprintComponent } from '../update-sprint/update-sprint.component';

@Component({
  selector: 'app-list-sprint',
  templateUrl: './list-sprint.component.html',
  styleUrls: ['./list-sprint.component.css'],
})
export class ListSprintComponent implements OnInit {
  show: boolean = true;
  sprintData: any;
  boardData: any;
  sprintId: any;
  boardId: any;
  message: string;

  constructor(
    private _sprintService: SprintService,
    private _router: Router,
    private _activeRoute: ActivatedRoute,
    private _matDialog: MatDialog,
    private _utilitiesService: UtilitiesService,
    private _boardService: BoardService
  ) {
    this.sprintData = {};
    this.boardData = {};
    this.sprintId = null;
    this.boardId = null;
    this.message = '';
  }

  ngOnInit(): void {
    let now = new Date();
    
    this.chargeBoard();
    this._sprintService.listSprints.subscribe((res) => {
      let anyArray: any[] = res.sprint
      for (const i in anyArray) {
        let start = new Date(anyArray[i].startDate)
        let end = new Date(anyArray[i].endDate)

        if(start <= now && now <= end){
          anyArray[i].color = 'aquamarine';
        }else if(now < start){
          anyArray[i].color = 'lightgray';
        }else if(end < now){
          anyArray[i].color = 'coral';
        }
        anyArray[i].sprintOptions = false;
      }
      this.sprintData = anyArray;
    });
  }

  ngOnChanges(entryId: string) {
    this.chargeSprint(entryId);
  }

  chargeBoard() {
    this._boardService
      .getBoardById(this._activeRoute.snapshot.params.boardId)
      .subscribe(
        (res) => {
          this.boardData = res.board;
          this._sprintService.updateListSprints(this.boardData._id);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  chargeSprint(sprintId: any) {
    this.sprintId = sprintId;
    for(let sprint of this.sprintData){
      if(sprint._id == this.sprintId){
        sprint.sprintOptions = !sprint.sprintOptions;
        console.log("sprint->",sprint);
        
      }else{
        sprint.sprintOptions = false;
      }
    }
  }

  chargeBoardId(boardId: any) {
    this.boardId = boardId;
  }

  updateSprint(sprintId: any, boardId: any) {
    this._matDialog.open(UpdateSprintComponent, {
      data: { sprintId, boardId },
      autoFocus: true,
      panelClass: [''],
      width: '400px',
      height: '500px',
    });
    this.chargeSprint(sprintId);
    this.chargeBoardId(boardId);
  }

  saveSprint(boardId: any) {
    this._matDialog.open(CreateSprintComponent, {
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

  addTask(sprintId: string, boardId: string) {
    this._matDialog.open(CreateTaskComponent, {
      data: { sprintId, boardId },
      autoFocus: true,
      panelClass: [''],
      width: '400px',
      height: '400px',
    });
    //this.chargeSprint(sprintId);
  }

  async deleteSprint() {
    let result = await this._utilitiesService.SweetAlertConfirmation(
      '¿Esta seguro de que desea eliminar el board seleccionado?',
      '¡No serás capaz de revertir estos cambios!',
      '¡Si, Eliminalo!',
      'warning'
    );

    if (result.isConfirmed) {
      this._sprintService.deleteSprint(this.sprintId).subscribe();
      this._utilitiesService.SweetAlert('Proceso Exitoso', 'Board eliminado con existo!', 'success');
      this._sprintService.updateListSprints(this.boardData._id);
    }
  }

}
