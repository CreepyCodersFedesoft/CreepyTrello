import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { UpdateUserComponent } from '../update-user/update-user.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  profileImage: string = '';
  userName: string = 'My User';

  constructor(
    public _userService: UserService,
    private _matDialog: MatDialog
  ) {}

  ngOnInit(): void {
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

  settings() {
    const matDialog = new MatDialogConfig();
    matDialog.autoFocus = true;
    matDialog.width = '50%';
    this._matDialog.open(UpdateUserComponent, matDialog);
  }
}
