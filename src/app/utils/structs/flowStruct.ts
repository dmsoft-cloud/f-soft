import { AuditlogStruct } from "./auditlogStruct"

export class FlowStruct extends AuditlogStruct  {

  public id: string;
  public description: string;
  public groupId: string;
  public note: string;
  public enabled: string;
  public model: string;
  public origin: string; 
  public interfaceId: string;
  public notificationFlow: string;
  public notificationOk: string;
  public notificationKo: string;
  public integrityFileName: string;
  public dbTable: string;
  public folder: string;
  public file: string;
  public remoteFolder: string;
  public remoteFile: string;
  public lengthFixed: number;
  public direction?: string;


  constructor(data: Partial<FlowStruct> = {} ) {
    super(data);
    this.id = data.id || "";
    this.description = data.description || "";
    this.groupId = data.groupId || "";
    this.note = data.note || "";
    this.enabled = data.enabled || "";
    this.model = data.model || "";
    this.origin = data.origin || "";
    this.interfaceId = data.interfaceId || "";
    this.notificationFlow = data.notificationFlow || "";
    this.notificationOk = data.notificationOk || "";
    this.notificationKo = data.notificationKo || "";
    this.integrityFileName = data.integrityFileName || "";
    this.dbTable = data.dbTable || "";
    this.folder = data.folder || "";
    this.file = data.file || "";
    this.remoteFolder = data.remoteFolder || "";
    this.remoteFile = data.remoteFile || "";
    this.lengthFixed = data.lengthFixed || 0;
    this.direction = data.direction || "";
   }


}