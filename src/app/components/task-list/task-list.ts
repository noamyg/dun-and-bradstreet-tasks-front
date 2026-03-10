import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { Button } from 'primeng/button';
import { TaskService } from '../../services/task.service';
import { UserService } from '../../services/user.service';
import { TaskResponse } from '../../models/task.model';
import { User } from '../../models/user.model';
import { TaskCard } from '../task-card/task-card';
import { TaskCreateDialog } from '../task-create-dialog/task-create-dialog';
import { StatusChangeDialog } from '../status-change-dialog/status-change-dialog';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Select, Button, FormsModule, TaskCard, TaskCreateDialog, StatusChangeDialog],
})
export class TaskList {
  private taskService = inject(TaskService);
  private userService = inject(UserService);

  users = signal<User[]>([]);
  selectedUser = signal<User | null>(null);
  tasks = signal<TaskResponse[]>([]);

  showCreateDialog = signal(false);
  showStatusDialog = signal(false);
  selectedTaskForStatus = signal<TaskResponse | null>(null);
  targetStatus = signal(0);

  constructor() {
    this.userService.getUsers().subscribe(users => this.users.set(users));
  }

  onUserChange(user: User) {
    this.selectedUser.set(user);
    this.loadTasks();
  }

  loadTasks() {
    const user = this.selectedUser();
    if (!user) return;
    this.taskService.getTasksByUser(user.id).subscribe(tasks => this.tasks.set(tasks));
  }

  onAdvanceStatus(task: TaskResponse) {
    this.selectedTaskForStatus.set(task);
    this.targetStatus.set(task.status + 1);
    this.showStatusDialog.set(true);
  }

  onReverseStatus(task: TaskResponse) {
    this.selectedTaskForStatus.set(task);
    this.targetStatus.set(task.status - 1);
    this.showStatusDialog.set(true);
  }

  onCloseTask(task: TaskResponse) {
    this.taskService.closeTask(task.id).subscribe(() => this.loadTasks());
  }

  onTaskCreated() {
    this.showCreateDialog.set(false);
    this.loadTasks();
  }

  onStatusChanged() {
    this.showStatusDialog.set(false);
    this.selectedTaskForStatus.set(null);
    this.loadTasks();
  }
}
