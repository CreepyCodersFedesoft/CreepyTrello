import { Component, OnInit } from '@angular/core';
import { SpringService } from 'src/app/services/spring.service';
import { Router } from '@angular/router';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-create-spring',
  templateUrl: './create-spring.component.html',
  styleUrls: ['./create-spring.component.css']
})
export class CreateSpringComponent implements OnInit {
  registerData: any;

  constructor(private _sprintService: SpringService, private _utilitiesService: UtilitiesService) { 
    this.registerData = {};
  }

  ngOnInit(): void {
  }

  saveSprint(){
    if(!this.registerData.title || !this.registerData.description) {
      this._utilitiesService.openSnackBarError("Datos incompletos");
      this.registerData = {};
    }else{
      this._sprintService.createSpring(this.registerData).subscribe(
        (res) => {
          this._utilitiesService.openSnackBarSuccesfull("Sprint creado");
          this.registerData = {};
        },
        (err) => {
          this._utilitiesService.openSnackBarError(err.error);
        }
      );
    }
  }

}
