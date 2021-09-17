import { Component, Inject, Input, OnInit } from '@angular/core';
import { SprintService } from 'src/app/services/sprint.service';
import { UtilitiesService } from '../../../services/utilities.service';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'app-update-sprint',
  templateUrl: './update-sprint.component.html',
  styleUrls: ['./update-sprint.component.css']
})
export class UpdateSprintComponent implements OnInit {
  @Input() sprintId: any = null;
  @Input() boardId: any = null;
  registerData: any;

  constructor(private _sprintService: SprintService, 
    private _utilitiesService: UtilitiesService,
    public _dialogRef: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: {
      sprintId: string,
      boardId: string
    }) {
    this.registerData = {};
  }

  ngOnInit(): void {
    this._sprintService.searchSprint(this.data.sprintId).subscribe(
      (res) => {
        this.registerData = res.sprint;
      },
      (err) => {
        this._utilitiesService.openSnackBarError(err.error);
      }
    );
  }

  updateSprint(){
    if (!this.registerData.title || !this.registerData.description) {
      this._utilitiesService.openSnackBarError('Datos incompletos');
    } else {
      this.registerData.boardId = this.data.boardId;
      this.registerData._id = this.data.sprintId;
      this._sprintService.updateSprint(this.registerData).subscribe(
        (res) => {
          this._sprintService.updateListSprints(this.registerData.boardId);
          this._utilitiesService.openSnackBarSuccesfull('Sprint actualizado');
        },
        (err) => {
          this._utilitiesService.openSnackBarError(err.error);
        }
      );
    }
  }

  onClose(): void {
    this._dialogRef.closeAll();
  }
}
