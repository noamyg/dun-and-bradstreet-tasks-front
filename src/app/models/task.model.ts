export interface TaskResponse {
  id: number;
  type: string;
  status: number;
  isClosed: boolean;
  assignedUserId: number;
  assignedUserName: string;
  createdAt: string;
  typeData: Record<string, string | null> | null;
  statusHistory: StatusHistoryEntry[];
}

export interface StatusHistoryEntry {
  fromStatus: number | null;
  toStatus: number;
  assignedUserId: number;
  assignedUserName: string;
  changedAt: string;
}

export interface CreateTaskRequest {
  type: number;
  assignedUserId: number;
}

export interface ChangeStatusRequest {
  newStatus: number;
  nextAssignedUserId: number;
  statusData: Record<string, string>;
}

const PROCUREMENT_STATUSES: Record<number, string> = {
  1: 'Created',
  2: 'Supplier Offers Received',
  3: 'Purchase Completed',
};

const DEVELOPMENT_STATUSES: Record<number, string> = {
  1: 'Created',
  2: 'Specification Completed',
  3: 'Development Completed',
  4: 'Distribution Completed',
};

export function getStatusLabel(type: string, status: number): string {
  const map = type === 'Procurement' ? PROCUREMENT_STATUSES : DEVELOPMENT_STATUSES;
  return map[status] ?? `Status ${status}`;
}

export function getMaxStatus(type: string): number {
  return type === 'Procurement' ? 3 : 4;
}

export interface FieldDef {
  key: string;
  label: string;
  multiline?: boolean;
}

export function getRequiredFields(type: string, nextStatus: number): FieldDef[] {
  if (type === 'Procurement') {
    if (nextStatus === 2) return [
      { key: 'priceQuote1', label: 'Price Quote 1' },
      { key: 'priceQuote2', label: 'Price Quote 2' },
    ];
    if (nextStatus === 3) return [{ key: 'receipt', label: 'Receipt' }];
  } else {
    if (nextStatus === 2) return [{ key: 'specificationText', label: 'Specification Text', multiline: true }];
    if (nextStatus === 3) return [{ key: 'branchName', label: 'Branch Name' }];
    if (nextStatus === 4) return [{ key: 'versionNumber', label: 'Version Number' }];
  }
  return [];
}
