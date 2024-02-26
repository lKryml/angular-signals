import { Component, inject } from '@angular/core';
import { TodoService } from '../todo.service';
import { take } from 'rxjs';
import { IPost } from '../todo.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
})
export class TodoComponent {
  todoService = inject(TodoService);
  formBuilder = inject(FormBuilder);

  todoForm = this.formBuilder.group({
    id: [-1],
    title: ['', Validators.required],
  });
  get todos() {
    return this.todoService.todos;
  }

  constructor() {
    this.todoService.getPosts().pipe(take(1)).subscribe();
  }

  deleteTodo(todoId: number | undefined) {
    if (!todoId) return;
    this.todoService.deletePost(todoId).subscribe();
  }

  addOrUpdateTodo(): void {
    if (this.todoForm.invalid) return;
    const todo = this.todoForm.value as IPost;
    this.todoForm.value.id === -1
      ? this._createPost(todo)
      : this._updatePost(todo);
  }

  private _updatePost(todo: IPost) {
    this.todoService
      .updatePost(todo)
      .pipe(take(1))
      .subscribe(() => {
        this.todoForm.reset({ id: -1 });
      });
  }

  private _createPost(todo: IPost) {
    this.todoService
      .createPost(todo)
      .pipe(take(1))
      .subscribe(() => {
        this.todoForm.reset({ id: -1 });
      });
  }

  editTodo(todo: IPost) {
    this.todoForm.patchValue(todo);
  }

  // this.todoForm.value.id === -1
  //     ? this.todoService.createPost(todo).subscribe
  //     : this.todoService.updatePost(todo).subscribe;
}
