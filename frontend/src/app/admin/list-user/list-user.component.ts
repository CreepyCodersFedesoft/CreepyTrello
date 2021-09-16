import { Component, OnInit, ViewChild  } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent implements OnInit {
  displayedColumns: string[] = ['Nombre', 'Email'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort = new MatSort();
  userData: any;

  constructor(private _userService: UserService, private _utilitiesService: UtilitiesService) { 
    this.userData = {};
    this.dataSource = new MatTableDataSource(this.userData);
  }

  ngOnInit(): void {
    this._userService.getAllUser().subscribe(
      (res) => {
        this.userData = res.users;
        this.dataSource = new MatTableDataSource(this.userData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (err) => {
        this._utilitiesService.openSnackBarError(err.error);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.userData.filter = filterValue.trim().toLowerCase();

    if (this.userData.paginator) {
      this.userData.paginator.firstPage();
    }
  }
}
