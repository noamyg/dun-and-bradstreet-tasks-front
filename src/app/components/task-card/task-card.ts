import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Card } from 'primeng/card';
import { Tag } from 'primeng/tag';
import { Button } from 'primeng/button';
import { getMaxStatus, getStatusLabel, TaskResponse } from '../../models/task.model';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.html',
  styleUrl: './task-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Card, Tag, Button, DatePipe],
})
export class TaskCard {
  task = input.required<TaskResponse>();
  advanceStatus = output<TaskResponse>();
  reverseStatus = output<TaskResponse>();
  closeTask = output<TaskResponse>();

  statusLabel = computed(() => getStatusLabel(this.task().type, this.task().status));
  canAdvance = computed(() => !this.task().isClosed && this.task().status < getMaxStatus(this.task().type));
  canReverse = computed(() => !this.task().isClosed && this.task().status > 1);
  canClose = computed(() => !this.task().isClosed && this.task().status === getMaxStatus(this.task().type));

  typeDataEntries = computed(() => {
    const data = this.task().typeData;
    if (!data) return [];

    const labels: Record<string, string> = {
      priceQuote1: 'Price Quote 1',
      priceQuote2: 'Price Quote 2',
      receipt: 'Receipt',
      specificationText: 'Specification',
      branchName: 'Branch',
      versionNumber: 'Version',
    };

    return Object.entries(data)
      .filter(([k, v]) => v && labels[k])
      .map(([k, v]) => ({ label: labels[k], value: v as string }));
  });
}
