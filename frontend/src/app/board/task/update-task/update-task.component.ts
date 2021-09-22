import { Component, Inject, Input, OnInit } from '@angular/core';
import { TaskService } from '../../../services/task.service';
import { UserService } from '../../../services/user.service';
import { SprintService } from '../../../services/sprint.service';
import { UtilitiesService } from '../../../services/utilities.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-update-task',
  templateUrl: './update-task.component.html',
  styleUrls: ['./update-task.component.css'],
})
export class UpdateTaskComponent implements OnInit {
  @Input() sprintId: any = null;
  registerData: any;
  selectedFile: any;
  sprints: Array<any>;

  constructor(
    private _taskService: TaskService,
    private _sprintService: SprintService,
    private _utilitiesService: UtilitiesService,
    public _dialogRef: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      taskId: any;
      taskStatus: any;
    }
  ) {
    this.registerData = {};
    this.sprints = [];
    this.selectedFile = null;
  }

  ngOnInit(): void {
    this._taskService.findTask(this.data.taskId).subscribe(
      (res) => {
        this.registerData = res.task;
        this._sprintService.listSprints.subscribe(
          (res) => {
            this.sprints = res.sprint;
          },
          (err) => {
            this._utilitiesService.openSnackBarError(err.error);
          }
        );
      },
      (err) => {
        this._utilitiesService.openSnackBarError(err.error);
      }
    );
  }
  uploadImg(event: any) {
    this.selectedFile = <File>event.target.files[0];
  }
  updateTask() {
    if (!this.registerData.title || !this.registerData.description) {
      this._utilitiesService.openSnackBarError('Datos de tarea incompletos');
    } else {
      const data = new FormData();
      if (
        this.registerData.priority != null &&
        this.registerData.priority !== ''
      ) {
        data.append('priority', this.registerData.priority);
      }
      if (this.selectedFile != null) {
        data.append('image', this.selectedFile, this.selectedFile.name);
      }
      data.append('title', this.registerData.title);
      data.append('description', this.registerData.description);
      data.append('sprintId', this.registerData.sprintId);
      data.append('_id', this.data.taskId);
      data.append('taskStatus', this.data.taskStatus);

      this._taskService.updateTask(data).subscribe(
        (res) => {
          this._utilitiesService.openSnackBarSuccesfull(
            'Successfull update task'
          );
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
