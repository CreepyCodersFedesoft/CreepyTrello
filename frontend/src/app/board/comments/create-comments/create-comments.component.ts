import { Component, Input, OnInit } from '@angular/core';
import { CommentService } from 'src/app/services/comment.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-create-comments',
  templateUrl: './create-comments.component.html',
  styleUrls: ['./create-comments.component.css']
})
export class CreateCommentsComponent implements OnInit {
  @Input() taskId: any;
  text: string;
  constructor(
    private _commentService: CommentService,
    private _utilitiesService: UtilitiesService,
    ) { 
    this.text = '';
  }

  ngOnInit(): void {
  }

  sendComment(){
    this._commentService.createComment({
      taskId: this.taskId,
      text: this.text
    })
    .subscribe(
      (res) => {
        this.text = '';
        console.log(res);
      },
      (err) => {
        this.text = '';
        this._utilitiesService.openSnackBarError(err.error);
      }
    );
  }


  enterPress(event: KeyboardEvent){
    if(event.code === 'Enter'){
      this.sendComment(); 
    }
  }
}
