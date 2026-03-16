export interface ADAIssue {
  severity: 'error' | 'warning';
  code: string;
  message: string;
  signTypeId?: string;
  zoneId?: string;
  suggestion?: string;
}

export interface ADAResult {
  valid: boolean;
  errors: ADAIssue[];
  warnings: ADAIssue[];
}
