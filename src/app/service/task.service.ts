import { Component, Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({ providedIn: 'root' })
// @Component({
//   selector: 'app-home',
//   imports: [NgFor, NgStyle, NgOptimizedImage],
//   templateUrl: './home.component.html',
//   styleUrl: './home.component.scss'
// })
export class taskService {
  constructor(private http: HttpClient) {}

  public tables: any;

  initTask() {
    localStorage.setItem(
      'tasks',
      JSON.stringify([
        { title: 'A faire', tasks: ['Task 1', 'Task 2', 'Task 3'] },
        { title: 'En cours', tasks: ['Task 4'] },
        { title: 'Terminé', tasks: ['Task 5', 'Task 6'] },
      ])
    );
  }

  allTasks() {
    const accessToken = JSON.parse(localStorage.getItem('token') || '');
    return this.http.get('http://localhost:3000/todos/', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
      }),
    });
  }

  addTask(task: string) {
    const accessToken = JSON.parse(localStorage.getItem('token') || '');
    return this.http.patch(
      'http://localhost:3000/todos/',
      { task: task },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + accessToken,
        }),
      }
    );
  }

  updateTask(task: {}, last: string, next: string) {
    console.log({ task: task, last: last, next: next });
    const accessToken = JSON.parse(localStorage.getItem('token') || '');
    return this.http
      .put(
        'http://localhost:3000/todos/update',
        {
          task: task,
          last: last,
          next: next,
        },
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + accessToken,
          }),
        }
      )
      .subscribe();
    // localStorage.setItem('tasks', JSON.stringify(task));
  }
}
