import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ChangeStatusRequest, CreateTaskRequest, TaskResponse } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private http = inject(HttpClient);

  getTasksByUser(userId: number) {
    return this.http.get<TaskResponse[]>(`${environment.apiUrl}/tasks/assigned-to/${userId}`);
  }

  createTask(request: CreateTaskRequest) {
    return this.http.post<TaskResponse>(`${environment.apiUrl}/tasks`, request);
  }

  changeStatus(taskId: number, request: ChangeStatusRequest) {
    return this.http.patch<TaskResponse>(`${environment.apiUrl}/tasks/${taskId}/status`, request);
  }

  closeTask(taskId: number) {
    return this.http.post<TaskResponse>(`${environment.apiUrl}/tasks/${taskId}/close`, {});
  }
}
