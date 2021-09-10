import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  profileImage: string = '';
  userName: string = 'My User';

  constructor(public _userService: UserService) { }

  ngOnInit(): void {
    if(this._userService.loggedIn()){
      this._userService.getEmail().subscribe(
        (res) => {
          console.log(res);
          
          this.profileImage = res.userImg;
          this.userName = res.name;
        },
        (err) => {

        }
      );
    }
  }

}
