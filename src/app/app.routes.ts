import { Routes } from '@angular/router';
import { PostComponent } from './post/post.component';

export const routes: Routes = [
  { path: 'posts', component: PostComponent },
  { path: '', redirectTo: '/posts', pathMatch: 'full' }
];
