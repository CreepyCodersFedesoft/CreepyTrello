import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { SprintService } from '../../../services/sprint.service';
import { CreateTaskComponent } from '../../task/create-task/create-task.component';
import { CreateSprintComponent } from '../create-sprint/create-sprint.component';
import swal from 'sweetalert2';
import { BoardService } from 'src/app/services/board.service';
import { UpdateSprintComponent } from '../update-sprint/update-sprint.component';

//cHIPS
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
//END CHIPS

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

  //CHIPS variables utilizadas en chips
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  fruits: string[] = ['Lemon'];
  allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];
  @ViewChild('fruitInput') fruitInput!: ElementRef<HTMLInputElement>;
  //CHIPS

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

    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) =>
        fruit ? this._filter(fruit) : this.allFruits.slice()
      )
    );
  }

  ngOnInit(): void {
    let now = new Date();
    
    this.chargeBoard();
    this._sprintService.listSprints.subscribe((res) => {
      let anyArray: any[] = res.sprint;
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

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.fruits.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.fruitCtrl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.fruits.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter((fruit) =>
      fruit.toLowerCase().includes(filterValue)
    );
  }
}
