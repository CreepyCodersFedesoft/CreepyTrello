import { Component, Inject, Input, OnInit } from '@angular/core';
import { SpringService } from 'src/app/services/spring.service';
import { UtilitiesService } from '../../../services/utilities.service';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'app-update-spring',
  templateUrl: './update-spring.component.html',
  styleUrls: ['./update-spring.component.css']
})
export class UpdateSpringComponent implements OnInit {
  @Input() springId: any = null;
  @Input() boardId: any = null;
  registerData: any;

  constructor(private _springService: SpringService, 
    private _utilitiesService: UtilitiesService,
    public _dialogRef: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: {
      springId: string,
      boardId: string
    }) {
    this.registerData = {};
  }

  ngOnInit(): void {
    this._springService.searchSpring(this.data.springId).subscribe(
      (res) => {
        this.registerData = res.sprint;
      },
      (err) => {
        this._utilitiesService.openSnackBarError(err.error);
      }
    );
  }

  updateSpring(){
    if (!this.registerData.title || !this.registerData.description) {
      this._utilitiesService.openSnackBarError('Datos incompletos');
    } else {
      this.registerData.boardId = this.data.boardId;
      this.registerData._id = this.data.springId;
      this._springService.updateSpring(this.registerData).subscribe(
        (res) => {
          this._springService.updateListSprings(this.registerData.boardId);
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
