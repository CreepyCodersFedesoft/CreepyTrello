import { Component, Inject, Input, OnInit } from '@angular/core';
import { SpringService } from 'src/app/services/spring.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'app-create-spring',
  templateUrl: './create-spring.component.html',
  styleUrls: ['./create-spring.component.css']
})
export class CreateSpringComponent implements OnInit {
  registerData: any;
  @Input() boardId: any = null;

  constructor(private _sprintService: SpringService, private _utilitiesService: UtilitiesService, public _dialogRef: MatDialog,
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
      this._sprintService.createSpring(this.registerData).subscribe(
        (res) => {
          this._sprintService.updateListSprings(this.registerData.boardId);
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
