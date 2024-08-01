import { Component, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  posts: any[] = [];
  newPost: any = {};

  constructor(private postService: PostService) { }

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts() {
    this.postService.getPosts().subscribe(data => {
      this.posts = data;
    });
  }

  addPost() {
    this.postService.createPost(this.newPost).subscribe(() => {
      this.loadPosts();
      this.newPost = {}; // Réinitialiser le formulaire
    });
  }

  updatePost(id: number, updatedPost: any) {
    this.postService.updatePost(id, updatedPost).subscribe(() => {
      this.loadPosts();
    });
  }

  deletePost(id: number) {
    this.postService.deletePost(id).subscribe(() => {
      this.loadPosts();
    });
  }
}
