import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent implements OnInit {
  userData: any;

  constructor(private _userService: UserService, private _utilitiesService: UtilitiesService) { 
    this.userData = {};
  }

  ngOnInit(): void {
    this._userService.getAllUser().subscribe(
      (res) => {
        this.userData = res.users;
        console.log(res.users);
      },
      (err) => {
        this._utilitiesService.openSnackBarError(err.error);
      }
    );
  }
}
