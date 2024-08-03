import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostService } from '../post.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2'; // Importez SweetAlert2

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  posts: any[] = [];
  postForm: FormGroup;
  editingPost: any = null;

  constructor(private postService: PostService, private fb: FormBuilder) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts() {
    this.postService.getPosts().subscribe(data => {
      this.posts = data;
    });
  }

  onSubmit() {
    if (this.editingPost) {
      this.updatePost(this.editingPost.id, this.postForm.value);
    } else {
      this.addPost();
    }
  }

  addPost() {
    this.postService.createPost(this.postForm.value).subscribe(() => {
      this.loadPosts();
      this.postForm.reset(); // Réinitialisez le formulaire
      Swal.fire({
        title: 'Succès!',
        text: 'Post ajouté avec succès.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    }, error => {
      Swal.fire({
        title: 'Erreur!',
        text: 'Une erreur est survenue lors de l\'ajout du post.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    });
  }

  editPost(post: any) {
    this.editingPost = post;
    this.postForm.setValue({
      title: post.title,
      content: post.content
    });
  }

  updatePost(id: number, updatedPost: any) {
    this.postService.updatePost(id, updatedPost).subscribe(() => {
      this.loadPosts();
      this.cancelEdit();
      Swal.fire({
        title: 'Succès!',
        text: 'Post mis à jour avec succès.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    }, error => {
      Swal.fire({
        title: 'Erreur!',
        text: 'Une erreur est survenue lors de la mise à jour du post.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    });
  }

  cancelEdit() {
    this.editingPost = null;
    this.postForm.reset(); // Réinitialisez le formulaire
  }

  deletePost(id: number) {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'Vous ne pourrez pas récupérer ce post après l\'avoir supprimé!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.postService.deletePost(id).subscribe(() => {
          this.loadPosts();
          Swal.fire(
            'Supprimé!',
            'Le post a été supprimé.',
            'success'
          );
        }, error => {
          Swal.fire({
            title: 'Erreur!',
            text: 'Une erreur est survenue lors de la suppression du post.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        });
      }
    });
  }
}
