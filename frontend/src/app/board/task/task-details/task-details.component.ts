import { Component, Input, OnInit } from '@angular/core';
import { TaskService } from '../../../services/task.service';
import { UserService } from 'src/app/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilitiesService } from '../../../services/utilities.service';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent  {
  @Input() springId: any = null;
  registerData: any;
  selectedFile: any;
  message: string = '';
  _id: string;
  profileImage: string = '';
  userName: string = 'My User';

  constructor(
    private _taskService: TaskService,
    private _utilitiesService: UtilitiesService,
    private _matDialog: MatDialog,
    private _router: Router,
    private _Arouter: ActivatedRoute,
    public _userService: UserService,
  ) {
    this.registerData = {}
    this._id = '';
  }
  ngOnInit(): void {
this._Arouter.params.subscribe(
  (params) => {
    this._id = params['_id'];
    this._taskService.findTask(this._id).subscribe(
      (res)=>{
        this.registerData = res.task
        console.log(this.registerData);
        
      },
      (err)=>{    
        this.message = err.error;
        this._utilitiesService.openSnackBarError(this.message);
      }
    )
  }
)
  }

  updateTask(){

  }
  chargeData() {
    if (this._userService.loggedIn()) {
      this._userService.getEmail().subscribe(
        (res) => {
          //console.log(res);
          this.profileImage = res.userImg;
          this.userName = res.name;
        },
        (err) => {}
      );
    }
  }

  enterSprint(id: any):void {
    console.log("viendo que sale "+id);
    this._router.navigate([`task/${id}`]);
  }
}
