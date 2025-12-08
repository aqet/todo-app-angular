import { NgFor, NgStyle, NgOptimizedImage, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { taskService } from '../service/task.service';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ViewChildren, QueryList } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-home',
  imports: [
    NgFor,
    NgStyle,
    NgOptimizedImage,
    NgIf,
    CdkDrag,
    CdkDropList,
    DatePipe,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  constructor(
    private taskService: taskService,
    private authService: AuthService
  ) {}
  @ViewChildren(CdkDropList) dropLists!: QueryList<CdkDropList>;

  public modal: boolean = false;
  public tables: any;

  ngOnInit(): void {
    this.gettask();
    if (!localStorage.getItem('tasks')) {
      this.taskService.initTask();
    }
  }
  openCloseModal() {
    this.modal = !this.modal;
    setTimeout(() => {
      document.querySelector('input')?.focus();
    }, 100);
  }

  gettask() {
    this.taskService.allTasks().subscribe((data: any) => {
      data.map((els: any) => {
        els?.tasks.map((el: any) => {
          this.getUserName(el.user).subscribe((data: any) => {
            el.username = data.Username;
          });
        });
      });
      this.tables=data

      // this.taskService.tables = data;
    });
  }

  addtask() {
    const task = document.querySelector('input')?.value;

    if (task) {
      this.taskService.addTask(task);
      this.gettask();
      this.openCloseModal();
    }
  }

  get lists() {
    return this.dropLists?.toArray();
  }

  getUserName(id: string) {
    return this.authService.getUserName(id);
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    // console.log(
    //   event.previousContainer.element.nativeElement.firstChild?.textContent,
    //   event.container.element.nativeElement.firstChild?.textContent
    // );
    this.taskService.updateTask(
      event.item.data,
      event.previousContainer.element.nativeElement.firstChild
        ?.textContent as string,
      event.container.element.nativeElement.firstChild?.textContent as string
    );
    // this.taskService.updateTask(this.tables)
  }
}
