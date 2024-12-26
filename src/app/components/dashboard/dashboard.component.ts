import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{

  totalTasks = 0;
  upcomingTasks = 0;
  completedTasks = 0;

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.updateTaskCounts();
  }

  updateTaskCounts() {
    const taskCounts = this.taskService.getTaskCounts();  
    this.totalTasks = taskCounts.total;
    this.upcomingTasks = taskCounts.upcoming;
    this.completedTasks = taskCounts.completed;
  }
}
