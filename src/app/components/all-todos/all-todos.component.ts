import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';


export interface Todo {
  id: number;
  title: string;
  checked: boolean;
  editMode: boolean;
}

@Component({
  selector: 'app-all-todos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './all-todos.component.html',
  styleUrl: './all-todos.component.scss'
})


export class AllTodosComponent implements OnInit {
  todos: Todo[] = []
  error: string = '';
  title: string = '';
  newTodo: string = '';
  loading: boolean = true;

  constructor(private http: HttpClient) { }


  async ngOnInit() {
    try {
        this.todos = await this.loadTodos();
    } catch (e) {
        this.error = 'Fehler beim Laden';
    } 
}


  loadTodos() {
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem("token")}`
    });
    const url = environment.baseUrl + '/todos/';
    return lastValueFrom(this.http.get<Todo[]>(url, { headers }));
}


  async createTodo(): Promise<void> {
    if (this.title.trim() !== '') {
      try {
        const url = environment.baseUrl + "/todos/";
        const body = {
          "title": this.title,
          "chacked": false
        };
        const response = await lastValueFrom(this.http.post(url, body));
        this.todos = await this.loadTodos();
        this.title = '';
      } catch (error) {
        console.error('Error creating todo:', error);
      }
    }
  }


  async deleteTodo(todo: Todo) {
    try {
      const url = environment.baseUrl + '/todos/' + todo.id + '/';
      await lastValueFrom(this.http.delete(url));
      this.todos = this.todos.filter((t: { id: number; }) => t.id !== todo.id);
    } catch (e) {
      console.error('Error deleting todo:', e);
    }
  }


  async updateTodoCheckbox(todo: Todo) {
    todo.checked = !todo.checked;
    try {
      const url = `${environment.baseUrl}/todos/${todo.id}/`;
      await lastValueFrom(this.http.put(url, { checked: todo.checked }));
    } catch (e) {
      this.error = 'Error updating completion status';
    }
  }


  async updateTodoTitle(todo: Todo) {
    if (todo.title.trim() !== '') {
      try {
        const url = `${environment.baseUrl}/todos/${todo.id}/`;
        await lastValueFrom(this.http.put(url, { title: todo.title }));
      } catch (e) {
        this.error = 'Error updating title';
      }
    } else {
      this.deleteTodo(todo)
    }
  }


  async toggleEditMode(todo: Todo) {
    let titleBefore = todo.title;
    if (todo.title.trim() !== '') {
      todo.editMode = !todo.editMode;
      if (titleBefore !== this.title) {
        this.updateTodoTitle(todo)
      }
    }
    else {
      this.deleteTodo(todo)
    }
  }

}
