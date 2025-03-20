
export class AuditlogStruct {
  public creationUser?: string;
  public creationTs?: string;
  public updateUser?: string;
  public updateTs?: string;

  constructor(data?: Partial<AuditlogStruct>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}