import { Component, OnInit, EventEmitter } from '@angular/core';
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
  onAdd = new EventEmitter();

  constructor(private _sprintService: SpringService, private _utilitiesService: UtilitiesService) { 
    this.registerData = {};
  }

  ngOnInit(): void {
  }

  saveSprint(){
    this.onAdd.emit(this.registerData);
  }
}
