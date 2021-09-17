import { Component, OnInit, ViewChild  } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent implements OnInit {
  displayedColumns: string[] = ['Foto', 'Nombre', 'Email', 'Role'];
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
        console.log(res.users);
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
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
