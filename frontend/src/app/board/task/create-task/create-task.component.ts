import { Component, Inject, Input, OnInit } from '@angular/core';
import { TaskService } from '../../../services/task.service';
import { BoardService } from '../../../services/board.service';
import { Router } from '@angular/router';
import { UtilitiesService } from '../../../services/utilities.service';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css'],
})
export class CreateTaskComponent implements OnInit {
  @Input() sprintId: any = null;
  registerData: any;
  selectedFile: any;
  message: string = '';
  boardImg: any = '';
  usersData: any[];

  constructor(
    private _taskService: TaskService,
    private _router: Router,
    private _utilitiesService: UtilitiesService,
    private _boardService: BoardService,
    public _dialogRef: MatDialog,
    private _sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      sprintId: string;
      boardId: string;
    }
  ) {
    this.registerData = {};
    this.selectedFile = null;
    this.usersData = [];
  }

  ngOnInit(): void {
    this._boardService.getUsersOnBoard(this.data.boardId).subscribe(
      (res) => {
        this.usersData = res.filteredList;
      },
      (err) => {
        this._utilitiesService.openSnackBarError(
          'No se han encontrado usuarios invitados al Board'
        );
      }
    );
  }

  uploadImg(event: any) {
    this.selectedFile = <File>event.target.files[0];
    this.boardImg = this._sanitizer.bypassSecurityTrustUrl(
      URL.createObjectURL(this.selectedFile)
    );
  }

  createTask() {
    if (!this.registerData.title || !this.registerData.description) {
      this.message = 'Failed process: Imcomplete data';

      this.registerData = {};
    } else {
      const data = new FormData();
      if (this.selectedFile != null) {
        data.append('image', this.selectedFile, this.selectedFile.name);
      }
      if (this.registerData.assignedUser != null && this.registerData.assignedUser !== '') {
        data.append('assignedUser', this.registerData.assignedUser);
      }
      if (this.registerData.priority != null && this.registerData.priority !== '') {
        data.append('priority', this.registerData.priority);
      }
      data.append('title', this.registerData.title);
      data.append('description', this.registerData.description);
      data.append('sprintId', this.data.sprintId);//registerData.assignedUser


      this._utilitiesService.openSnackBarSuccesfull(
        'creando tarea con inf' + data
      );

      this._taskService.createTask(data).subscribe(
        (res) => {
          //this._router.navigate([`sprints/${this.data.boardId}`])
          this._taskService.updateListTask(this.data.sprintId);
          this._utilitiesService.openSnackBarSuccesfull('Task Create');
          this.registerData = {};
        },
        (err) => {
          this.message = err.error;
          this._utilitiesService.openSnackBarError(this.message);
        }
      );
    }
  }

  enterPress(event: KeyboardEvent){
    if(event.code === 'Enter'){
      this.createTask(); 
      this.onClose();
    }
  }

  onClose(): void {
    this._dialogRef.closeAll();
  }
}
