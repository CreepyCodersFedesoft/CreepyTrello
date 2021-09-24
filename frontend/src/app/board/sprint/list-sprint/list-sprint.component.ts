import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { SprintService } from '../../../services/sprint.service';
import { CreateTaskComponent } from '../../task/create-task/create-task.component';
import { CreateSprintComponent } from '../create-sprint/create-sprint.component';
import swal from 'sweetalert2';
import { BoardService } from 'src/app/services/board.service';
import { UserService } from 'src/app/services/user.service';
import { UpdateSprintComponent } from '../update-sprint/update-sprint.component';

//cHIPS
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
//END CHIPS

import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-list-sprint',
  templateUrl: './list-sprint.component.html',
  styleUrls: ['./list-sprint.component.css'],
})
export class ListSprintComponent implements OnInit {
  registerData: any;
  show: boolean = true;
  sprintData: any;
  boardData: any;
  sprintId: any;
  boardId: any;
  message: string;
  selectedFile: any;
  userImg: any = '';
  registerBoard: any;

  //CHIPS variables utilizadas en chips
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  emailCtrl = new FormControl();
  filteredEmails: Observable<string[]>;
  emails: string[] = [];
  allMails: string[] = [];


  @ViewChild('emailInput') emailInput!: ElementRef<HTMLInputElement>;
  dataMail: any;
  //End CHIPS


  //end Update Form
  constructor(
    private _sprintService: SprintService,
    private _router: Router,
    private _activeRoute: ActivatedRoute,
    private _matDialog: MatDialog,
    private _utilitiesService: UtilitiesService,
    private _boardService: BoardService,
    private _userService: UserService,
    private _sanitizer: DomSanitizer
  ) {
    this.sprintData = {};
    this.boardData = {};
    this.sprintId = null;
    this.boardId = null;
    this.message = '';

    this.filteredEmails = this.emailCtrl.valueChanges.pipe(
      startWith(null),
      map((mail: string | null) =>
        mail ? this._filter(mail) : this.allMails.slice()
      )
    );
  }

  ngOnInit(): void {
    let now = new Date();

    this.chargeBoard();
    this.getMails();
    this._sprintService.listSprints.subscribe((res) => {
      let anyArray: any[] = res.sprint;
      for (const i in anyArray) {
        let start = new Date(anyArray[i].startDate);
        let end = new Date(anyArray[i].endDate);

        if (start <= now && now <= end) {
          anyArray[i].color = 'aquamarine';
        } else if (now < start) {
          anyArray[i].color = 'lightgray';
        } else if (end < now) {
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
          //console.log(res.board)
          this._sprintService.updateListSprints(this.boardData._id);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  chargeSprint(sprintId: any) {
    this.sprintId = sprintId;
    for (let sprint of this.sprintData) {
      if (sprint._id == this.sprintId) {
        sprint.sprintOptions = !sprint.sprintOptions;
      } else {
        sprint.sprintOptions = false;
      }
    }
  }

  onChangeSprint(e: any) {
    this.chargeSprint(e);
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
      panelClass: ['dialog'],
      width: '500px',
      height: '470px',
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
      this._sprintService.deleteSprint(this.sprintId).subscribe(
        (res) => {
          this._utilitiesService.SweetAlert(
            'Proceso Exitoso',
            'Board eliminado con existo!',
            'success'
          );
          this._sprintService.updateListSprints(this.boardData._id);
        },
        (err) => {
          this._utilitiesService.openSnackBarError(err.error);
        }
      );
    }
  }

  //CHIPS METHODS
  getMails() {
    this._userService.getAllEmails().subscribe(
      (res) => {
        for (let mail of res.user) {
          this.allMails.push(mail.email);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim().toLowerCase();

    // Add our mail
    if (value) {
      this.emails.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
    this.emailCtrl.setValue(null);
  }

  remove(mail: string): void {
    const index = this.emails.indexOf(mail);
    if (index >= 0) {
      this.emails.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    var index = this.emails.indexOf(
      event.option.viewValue.trim().toLowerCase()
    );
    if (index === -1) {
      this.emails.push(event.option.viewValue);
    }
    this.emailInput.nativeElement.value = '';
    this.emailCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allMails.filter((mail) =>
      mail.toLowerCase().includes(filterValue)
    );
  }
  //END CHIPS METHODS
  updateBoard(description: string, name: string) {
    const id = this.boardData._id;
    if (!id || !name || !description) {
      name = '';
      description = '';
      this.selectedFile = null;
    } else {
      const data = new FormData();
      if (this.selectedFile != null) {
        data.append('image', this.selectedFile, this.selectedFile.name);
      }
      data.append('_id', id);
      data.append('name', name);
      data.append('description', description);

      this._boardService.updateBoard(data).subscribe(
        (res) => {
          this.chargeBoard();
          //this._router.navigate(['/sprints/'+id]);
          this._router.navigate(['/listBoard/']);
          this._utilitiesService.openSnackBarSuccesfull(
            'Successfull board updated.'
          );
          this.registerData = {};
        },
        (err) => {
          console.log(err.error);
          this._utilitiesService.openSnackBarError(err.error);
        }
      );
    }
  }

  uploadImg(event: any) {
    this.selectedFile = <File>event.target.files[0];
    this.userImg = this._sanitizer.bypassSecurityTrustUrl(
      URL.createObjectURL(this.selectedFile)
    );
  }

  mailAction(){
    for (let email of this.emails){   
      this._userService.getUserByEmail(email).subscribe(
        (res) => {         
          const user = res.user;
          const idBoard = this.boardData._id;
          const boardName = this.boardData.name;

          let data = {};
          data = {_id:idBoard,newUserId:user._id, mail:email, userName:user.name, boardName:boardName}     
  
          this.createUserBoard(data, email);
        },
        (err) => {
          console.log(err.error);
          this._utilitiesService.openSnackBarError(err.error);
        }
      );
    }
  }

  createUserBoard(data:any, email:string){

    this._boardService.addListBoard(data).subscribe(
      (res) => {
        console.log(res);              
      },
      (err) => {
        console.log(err.error);
        this._utilitiesService.openSnackBarError(err.error);
      }
    );
  }
}
