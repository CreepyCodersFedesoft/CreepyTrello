import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SpringService } from "../../../services/spring.service";
@Component({
  selector: 'app-list-spring',
  templateUrl: './list-spring.component.html',
  styleUrls: ['./list-spring.component.css']
})
export class ListSpringComponent implements OnInit {
  show: boolean = true;
  springData: any;
  springId: any;

  constructor(
    private _springService: SpringService,
    private _router: Router,
    private _activeRoute: ActivatedRoute
  ) { 
    this.springData = {};
    this.springId = null;
  }

  ngOnInit(): void {
    console.log(this._activeRoute.snapshot.params);
    
    //debe llegar el id del board y en base a este listar los springs
    this._springService.listSpring(this._activeRoute.snapshot.params.boardId).subscribe(
      (res) => {
        console.log(res);
        if(res.spring.length === 0){
          console.log("no hay spring en este board!");//cambiar por mensaje de snackbar de utilities
          
          //this._router.navigate(['createSpring']);
        } else {
          this.springData = res;
        }
      },
      (err) => {
        
      }
    );
  }


  chargeSpring(springId: any ){
    console.log(`My spring ID is ${springId}`);
    //this._router.navigate([`/springs/${springId}`])
    this.springId = springId;
  }


  change() {
    this.show = !this.show;
  }


}
