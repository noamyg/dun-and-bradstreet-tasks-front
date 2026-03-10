import { ChangeDetectionStrategy, Component, computed, effect, inject, input, model, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { Select } from 'primeng/select';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { TaskService } from '../../services/task.service';
import { getRequiredFields, getStatusLabel, TaskResponse } from '../../models/task.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-status-change-dialog',
  templateUrl: './status-change-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Dialog, Select, Button, InputText, Textarea, FormsModule],
})
export class StatusChangeDialog {
  visible = model.required<boolean>();
  task = input<TaskResponse | null>(null);
  users = input.required<User[]>();
  statusChanged = output<void>();

  private taskService = inject(TaskService);

  targetStatus = input(0);
  currentStatusLabel = computed(() => {
    const t = this.task();
    return t ? getStatusLabel(t.type, t.status) : '';
  });
  targetStatusLabel = computed(() => {
    const t = this.task();
    return t ? getStatusLabel(t.type, this.targetStatus()) : '';
  });
  requiredFields = computed(() => {
    const t = this.task();
    return t ? getRequiredFields(t.type, this.targetStatus()) : [];
  });

  selectedUser = signal<User | null>(null);
  statusData = signal<Record<string, string>>({});

  canSubmit = computed(() => {
    if (!this.selectedUser()) return false;
    const fields = this.requiredFields();
    const data = this.statusData();
    return fields.every(f => data[f.key]?.trim());
  });

  constructor() {
    effect(() => {
      this.task();
      this.reset();
    });
  }

  updateField(key: string, value: string) {
    this.statusData.update(data => ({ ...data, [key]: value }));
  }

  submit() {
    const task = this.task();
    const user = this.selectedUser();
    if (!task || !user) return;

    this.taskService.changeStatus(task.id, {
      newStatus: this.targetStatus(),
      nextAssignedUserId: user.id,
      statusData: this.statusData(),
    }).subscribe(() => {
      this.reset();
      this.statusChanged.emit();
    });
  }

  reset() {
    this.selectedUser.set(null);
    this.statusData.set({});
  }
}
