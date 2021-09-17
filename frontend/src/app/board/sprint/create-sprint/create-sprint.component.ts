import { Component, Inject, Input, OnInit } from '@angular/core';
import { SprintService } from 'src/app/services/sprint.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'app-create-sprint',
  templateUrl: './create-sprint.component.html',
  styleUrls: ['./create-sprint.component.css']
})
export class CreateSprintComponent implements OnInit {
  registerData: any;
  @Input() boardId: any = null;

  constructor(private _sprintService: SprintService, private _utilitiesService: UtilitiesService, public _dialogRef: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: {
      boardId: string
    }) { 
    this.registerData = {};
  }

  ngOnInit(): void {
  }

  saveSprint(){
    console.log("registerData-> ", this.registerData);
    if (
      !this.registerData.title ||
      !this.registerData.description ||
      !this.registerData.startDate ||
      !this.registerData.endDate
    ) {
      this._utilitiesService.openSnackBarError('Datos incompletos');
    } else {
      this.registerData.boardId = this.data.boardId;
      this._sprintService.createSprint(this.registerData).subscribe(
        (res) => {
          this._sprintService.updateListSprints(this.registerData.boardId);
          this._utilitiesService.openSnackBarSuccesfull('Sprint creado');
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
