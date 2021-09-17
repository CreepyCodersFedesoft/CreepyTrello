import { Component, OnInit, ViewChild  } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UpdateUserAdminComponent } from '../update-user-admin/update-user-admin.component';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent implements OnInit {
  displayedColumns: string[] = ['Foto', 'Nombre', 'Email', 'Role', 'Acciones'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort = new MatSort();
  userData: any;
  data: any;
  userId: any;

  constructor(private _userService: UserService, private _utilitiesService: UtilitiesService, private _matDialog: MatDialog) { 
    this.userData = {};
    this.data = {};
    this.dataSource = new MatTableDataSource(this.userData);
    this.userId = null;
  }

  ngOnInit(): void {
    this._userService.updateListTask();
    this._userService.listUsers.subscribe(
      (res) => {
        this.userData = res;
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

  deleteUser(user: any){
    this._userService.deleteUser(user).subscribe(
      (res) => {
        let index = this.userData.indexOf(user);
        if (index > -1) {
          console.log('1: ', this.userData);
          this.userData.splice(index, 1);
          console.log('2: ', this.userData);
          this.dataSource = new MatTableDataSource(this.userData);
          this._utilitiesService.openSnackBarSuccesfull('Usuario eliminado');
        }
      },
      (err) => {
        this._utilitiesService.openSnackBarError(err.error);
      }
    );
  }

  updateUser(userId: any){
    this._matDialog.open(UpdateUserAdminComponent, {
      data: { userId },
      autoFocus: true,
      panelClass: [''],
      width: '50%',
    });
    this.chargeData(userId);
  }

  chargeData(userId: any){
    this.userId = userId;
  }
}
