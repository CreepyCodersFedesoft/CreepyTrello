import { Component, OnInit } from '@angular/core';
import { TaskService } from "../../../services/task.service";
import { Router } from '@angular/router';
import { UtilitiesService } from "../../../services/utilities.service";


@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent implements OnInit {

  registerData: any;
  selectedFile: any;
  message: string = '';

  constructor(private _taskService: TaskService ,private _router: Router, private _utilitiesService: UtilitiesService) { 
    this.registerData = {};
    this.selectedFile = null;
  }

  ngOnInit(): void {
  }

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

      this._taskService.createTask(data).subscribe(
        (res) => {
          this._router.navigate(['/listTask']);
          this._utilitiesService.openSnackBarSuccesfull("Task Create")
          this.registerData = {};
        },
        (err) => {
          this.message = err.error;
          this._utilitiesService.openSnackBarError(this.message)
        }
      );
    }
  }

}
