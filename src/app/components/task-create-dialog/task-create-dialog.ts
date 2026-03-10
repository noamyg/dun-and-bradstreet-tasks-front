import { ChangeDetectionStrategy, Component, computed, inject, input, model, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { Select } from 'primeng/select';
import { Button } from 'primeng/button';
import { TaskService } from '../../services/task.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-task-create-dialog',
  templateUrl: './task-create-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Dialog, Select, Button, FormsModule],
})
export class TaskCreateDialog {
  visible = model.required<boolean>();
  users = input.required<User[]>();
  taskCreated = output<void>();

  private taskService = inject(TaskService);

  taskTypes = [
    { label: 'Procurement', value: 1 },
    { label: 'Development', value: 2 },
  ];

  selectedType = signal<number | null>(null);
  selectedUser = signal<User | null>(null);
  canSubmit = computed(() => !!this.selectedType() && !!this.selectedUser());

  submit() {
    const type = this.selectedType();
    const user = this.selectedUser();
    if (!type || !user) return;

    this.taskService.createTask({ type, assignedUserId: user.id }).subscribe(() => {
      this.reset();
      this.taskCreated.emit();
    });
  }

  reset() {
    this.selectedType.set(null);
    this.selectedUser.set(null);
  }
}
