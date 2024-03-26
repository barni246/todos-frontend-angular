import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
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


export class AllTodosComponent implements OnInit, AfterViewInit {
  todos: Todo[] = []
  error: string = '';
  title: string = '';
  newTodo: string ='';
  loading: boolean = true;


  constructor(private http: HttpClient) { }



  
ngAfterViewInit(): void {
    this.loading = false;
}
 






  //  async ngOnInit() {
  //    try {
  //      this.todos = await this.loadTodos();
  //      console.log(this.todos);
  //    } catch (e) {
  //      this.error = 'Fehler beim Laden!';
  //    }
  //  }


  //  loadTodos() {
  //    const headers = new HttpHeaders({
  //      'Authorization': `Token ${localStorage.getItem("token")}`
  //    });

  //    const url = environment.baseUrl + '/todos/';
  //    return lastValueFrom(this.http.get<Todo[]>(url, { headers }));
  //  }


  async ngOnInit() {
    try {
      this.todos = await this.loadTodos();
      console.log(this.todos);
    } catch (e) {
      this.error = 'Fehler!';
    } finally {
      this.loading = false; // Setze loading auf false, unabhängig davon, ob die Daten geladen wurden oder ein Fehler aufgetreten ist
    }
  }

  loadTodos() {
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem("token")}`
    });

    const url = environment.baseUrl + '/todos/';
    return lastValueFrom(this.http.get<Todo[]>(url, { headers }));
  }
  


  
  


  async updateTodoCheckbox(todo: Todo) {
    todo.checked = !todo.checked;
  
    try {
      const url = `${environment.baseUrl}/todos/${todo.id}/`;
      await lastValueFrom(this.http.put(url, { checked: todo.checked }));
    } catch (e) {
      this.error = 'Fehler beim Aktualisieren des erledigt-Status';
    }
  }
  

  async updateTodoTitle(todo: Todo) {
    try {
      const url = `${environment.baseUrl}/todos/${todo.id}/`;
      await lastValueFrom(this.http.put(url, { title: todo.title }));
    } catch (e) {
      this.error = 'Fehler beim Aktualisieren des Titels';
    }
  }
  

  async toggleEditMode(todo: Todo) {
    todo.editMode = !todo.editMode;
  }
  

  async createTodo(): Promise<void> {
    try {
      const url = environment.baseUrl + "/todos/";
      const body = {
        "title": this.title,
        "chacked": false
      };
     
      const response = await lastValueFrom(this.http.post(url, body));
      console.log('Todo created:', response);
      this.todos = await this.loadTodos();
      this.title = '';
    } catch (error) {
      console.error('Error creating todo:', error);
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
}
