import { Component, Inject, Input, OnInit } from '@angular/core';
import { TaskService } from '../../../services/task.service';
import { Router } from '@angular/router';
import { UtilitiesService } from '../../../services/utilities.service';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css'],
})
export class CreateTaskComponent implements OnInit {
  @Input() springId: any = null;
  registerData: any;
  selectedFile: any;
  message: string = '';

  constructor(
    private _taskService: TaskService,
    private _router: Router,
    private _utilitiesService: UtilitiesService,
    public _dialogRef: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: {
      springId: string,
      boardId: string
    },
  ) {
    this.registerData = {};
    this.selectedFile = null;
  }

  ngOnInit(): void {}

  uploadImg(event: any) {
    this.selectedFile = <File>event.target.files[0];
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
      data.append('title', this.registerData.title);
      data.append('description', this.registerData.description);
      data.append('springId', this.data.springId);
    
      this._utilitiesService.openSnackBarSuccesfull('creando tarea con inf'+ data);
      
      this._taskService.createTask(data).subscribe(
        (res) => {
          //this._router.navigate([`springs/${this.data.boardId}`])          
          this._taskService.updateListTask(this.data.springId);
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
  
  onClose(): void {
    this._dialogRef.closeAll();
  }

}
