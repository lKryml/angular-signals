import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

export interface IPost {
  id?: number;
  title: string;
}

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  http = inject(HttpClient);
  todos = signal<IPost[]>([]);
  constructor() {}

  getPosts(): Observable<IPost[]> {
    return this.http.get<IPost[]>('http://localhost:3000/posts').pipe(
      tap((res) => {
        this.todos.set(res);
      })
    );
  }

  createPost(post: IPost): Observable<IPost> {
    delete post.id;
    return this.http
      .post<IPost>('http://localhost:3000/posts', post)
      .pipe(tap(this._upsertTodo));
  }

  updatePost(post: IPost): Observable<IPost> {
    return this.http
      .put<IPost>(`http://localhost:3000/posts/${post.id}`, post)
      .pipe(tap(this._upsertTodo));
  }

  deletePost(id: number): Observable<IPost> {
    return this.http.delete<IPost>(`http://localhost:3000/posts/${id}`).pipe(
      tap((_) => {
        this.todos.set(this.todos().filter((todo) => todo.id !== id));
      })
    );
  }

  private _upsertTodo = (post: IPost) => {
    const index = this.todos().findIndex((todo) => {
      todo.id === post.id;
    });
    if (index === -1) {
      this.todos.set([...this.todos(), post]);
      return;
    }
    this.todos.mutate((todos) => (todos[index] = post));
  };
}
