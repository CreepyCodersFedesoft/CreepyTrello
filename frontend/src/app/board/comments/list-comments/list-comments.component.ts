import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { CommentService } from 'src/app/services/comment.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-list-comments',
  templateUrl: './list-comments.component.html',
  styleUrls: ['./list-comments.component.css']
})
export class ListCommentsComponent implements OnInit {
  @Input() taskId: string = "";

  commentData: any;

  constructor(
    private _commentService: CommentService,
    private _utilitiesService: UtilitiesService,
  ) { 
    this.commentData = [];
  }

  ngOnInit(): void {
    this.chargeComment();
  }
  chargeComment(){
    this._commentService.listComment(this.taskId).subscribe(
      (res) => {
        console.log(res);
        this.commentData = res.filteredUserData;
      },
      (err) => {
        this._utilitiesService.openSnackBarError('No se han encontrado comentarios');
      }
    );
  }
  onCreateComment(){
    this.chargeComment();
  }

  giveLike(comment: any) {

    this._commentService.giveLike({_id: comment._id}).subscribe(
      (res) => {
        this._utilitiesService.openSnackBarSuccesfull(res.msg);
      },
      (err) =>{
        this._utilitiesService.openSnackBarError(err);
      }
    );    

    if(comment.userLikes.includes(comment.userId._id)){
      comment.likes = comment.likes - 1;
      comment.userLikes.splice(comment.userLikes.indexOf(comment.userId._id), 1);      
    } else {
      comment.likes = comment.likes + 1;
      comment.userLikes.push(comment.userId._id);
    }     
  }

}
