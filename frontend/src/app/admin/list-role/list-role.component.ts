import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { RoleService } from 'src/app/services/role.service';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-list-role',
  templateUrl: './list-role.component.html',
  styleUrls: ['./list-role.component.css']
})
export class ListRoleComponent implements OnInit {
  registerData: any;
  updateData: any;
  message: string = '';
  taskData: any;
  panelOpenState = false;
  description: string;

  displayedColumns: string[] = ['Nombre', 'Descrip.'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort = new MatSort();

  constructor(
    private _utilitiesServices: UtilitiesService,
    private _roleService: RoleService,
    private _router: Router,
  ) {
    this.updateData = {};
    this.registerData = {};
    this.taskData = [];
    this.description=''
    this.dataSource = new MatTableDataSource(this.taskData);
  }

  ngOnInit(): void {
    this.listTask();
  }

  registerRole() {
    if (
      !this.registerData.name ||
      !this.registerData.description
    ) {
      this.message = 'Failed process: Incomplete data.';

      this.registerData = {};
    } else {
      this._roleService.registerRole(this.registerData).subscribe(
        (res) => {

          this._router.navigate(['/listRole']);
          this.message = 'Successfull role registration.';
          this._utilitiesServices.openSnackBarSuccesfull(this.message)
          this.registerData = {};
          this.listTask();
        },
        (err) => {
          this.message = err.error;
          this._utilitiesServices.openSnackBarError(err.error);
        }
      );
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getDescription(ob: any) {
    this.description='';
    this._roleService.getDescription(ob.value).subscribe(
      (res) => {
        this.description = res.description;
      },
      (err) => {
        this.description='';
        this.message = err.error;
        this._utilitiesServices.openSnackBarError(err.error);
      }
    );
  }


  updateRoleDesc(){
    console.log(this.updateData);
    
    if (
      !this.updateData._id ||
      !this.updateData.description
    ) {
      this.message = 'Failed process: Incomplete data.';
      this.updateData = {};
    } else {
      this._roleService.updateRole(this.updateData).subscribe(
        (res) => {
          this._router.navigate(['/listRole']);
          this.message = 'Role updated successfully.';
          this._utilitiesServices.openSnackBarSuccesfull(this.message)
          this.updateData = {};
          this.description = "";
          this.listTask();
        },
        (err) => {
          this.message = err.error;
          this._utilitiesServices.openSnackBarError(err.error);
        }
      );
    }  

  }

  listTask() {
    this._roleService.listRole().subscribe(
      (res) => {
        this.taskData = res.role;
        this.dataSource = new MatTableDataSource(this.taskData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (err) => {
        this.message = err.error;
        this._utilitiesServices.openSnackBarError(err.error);
      }
    );
  }

}
