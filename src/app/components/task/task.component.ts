import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from 'src/app/services/task.service';
import { Task } from 'src/app/model/task.model';

import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  taskForm: FormGroup;
  showForm = false;
  isEditMode = false;
  editIndex: number | null = null;
  tasks: Task[] = [];
  searchControl = new FormControl(''); 
  filteredTasks: Task[] = [];
  searchText: string = '';
  selectedStatus: string = 'All';
  sortOrder: 'asc' | 'desc' = 'desc';

  constructor(private fb: FormBuilder, private taskService: TaskService) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dueDate: ['', Validators.required],
      isCompleted: [false], 
      status: ['Pending']
    });
  }

  ngOnInit() {
    this.loadTasks();
    this.searchControl.valueChanges.subscribe((value : any) => {
      this.filterTasks(value, this.selectedStatus, this.sortOrder);
    });
  }
  

  loadTasks() {
    this.tasks = this.taskService.getTasks();
    this.filteredTasks = [...this.tasks];
    this.sortTasks(this.sortOrder);
  }

  filterTasks(searchText: string, status: string, sortOrder: 'asc' | 'desc') {
    const lowerCaseSearch = searchText?.toLowerCase() || '';
    this.filteredTasks = this.tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(lowerCaseSearch);
      const matchesStatus = status === 'All' || task.status === status; 
      return matchesSearch && matchesStatus;
    });
    this.sortTasks(sortOrder);
  }

  sortTasks(order: 'asc' | 'desc') {
    this.filteredTasks.sort((a, b) => {
      const dueDateA = new Date(a.dueDate);
      const dueDateB = new Date(b.dueDate);
      
      if (order === 'asc') {
        return dueDateA.getTime() - dueDateB.getTime();
      } else {
        return dueDateB.getTime() - dueDateA.getTime();
      }
    });
  }

  openForm(mode: 'add' | 'edit', index: number | null = null): void {
    this.isEditMode = mode === 'edit';
    this.editIndex = index;
    this.showForm = true;

    if (this.isEditMode && index !== null) {
      const task = this.tasks[index];
      this.taskForm.patchValue(task);
    } else {
      this.taskForm.reset();
    }
  }

  closeForm(): void {
    this.showForm = false;
    this.taskForm.reset();
    this.isEditMode = false;
    this.editIndex = null;
  }
  
  addTask(): void {
    if (this.taskForm.valid) {
      const newTask: Task = {
        ...this.taskForm.value,
        status: 'Pending',
      };

      if (this.isEditMode && this.editIndex !== null) {
        this.taskService.updateTask(this.editIndex, newTask);
      } else {
        this.taskService.addTask(newTask);
      }

      this.closeForm(); 
      this.loadTasks(); 
    }
  }

  deleteTask(index: number): void {
    this.taskService.deleteTask(index);
    this.loadTasks(); 
  }

  updateStatus(task: Task, isChecked: boolean): void {
    task.status = isChecked ? 'Completed' : 'Pending';
    this.taskService.updateTask(this.tasks.indexOf(task), { ...task }); 
    this.loadTasks(); 
  }
  
  onSearch(searchText: string | null) {
    const searchValue = searchText ?? ''; 
    this.filterTasks(searchValue, this.selectedStatus, this.sortOrder);
  }

  onStatusChange(value: string): void {
    this.selectedStatus = value;
    this.filterTasks(this.searchText, value, this.sortOrder);
  }

  onSortOrderChange(value: 'asc' | 'desc'): void {
    this.sortOrder = value; 
    this.filterTasks(this.searchText, this.selectedStatus, value); 
  }

}
