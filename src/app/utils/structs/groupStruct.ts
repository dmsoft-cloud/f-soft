import { AuditlogStruct } from "./auditlogStruct";

export class GroupStruct extends AuditlogStruct {
  public id: string;
  public description: string;
  public enabled: string;
  public notes: string;

  constructor(data: Partial<GroupStruct> = {}) {
    super(data); // Passa i campi di AuditlogStruct al costruttore padre
    this.id = data.id || "";
    this.description = data.description || "";
    this.enabled = data.enabled || "";
    this.notes = data.notes || "";
  }
}