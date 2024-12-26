import { Injectable } from '@angular/core';
import { Task } from '../model/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  tasks: Task[] =  JSON.parse(localStorage.getItem('tasks') || '[]');

  constructor() { }

  getTasks(): Task[] {
    return this.tasks;
  }

  addTask(task: Task) {
    this.tasks.push(task);
    this.updateLocalStorage();
  }

  updateTask(index: number, updatedTask: Task) {
    this.tasks[index] = updatedTask;
    this.updateLocalStorage();
  }

  deleteTask(index: number) {
    this.tasks.splice(index, 1);
    this.updateLocalStorage();
  }

  updateLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  getTaskCounts() {
    const total = this.tasks.length;
    const completed = this.tasks.filter(task => task.status === 'Completed').length;
    const upcoming = this.tasks.filter(task => task.status === 'Pending').length;

    return {
      total,
      completed,
      upcoming
    };
  }
}
