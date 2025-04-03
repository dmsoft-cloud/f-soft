import { AuditlogStruct } from "./auditlogStruct";

export class InterfaceStruct extends AuditlogStruct {

  public id: string;
  public description: string;
  public connectionType: string;
  public passiveMode: string;
  public secureFtp: string;
  public host: string;
  public port: number;
  public user: string;
  public password: string;
  public sftpAlias: string;
  public knownHost: string;
  public keyFile: string;
  public trustHost: string;
  public enabled: string;
  public note: string


  constructor(data: Partial<InterfaceStruct> = {}){
    super(data); // Passa i campi di AuditlogStruct al costruttore padre
    this.id = data.id || "";
    this.description = data.description || "";
    this.connectionType = data.connectionType || "";
    this.passiveMode = data.passiveMode || "";
    this.secureFtp = data.secureFtp || "";
    this.host = data.host || "";
    this.port= data.port || 0;
    this.user = data.user  || "";
    this.password = data.password  || "";
    this.sftpAlias = data.sftpAlias  || "";
    this.knownHost = data.knownHost  || "";
    this.keyFile = data.keyFile  || "";
    this.trustHost = data.trustHost  || "";
    this.enabled = data.enabled  || "";
    this.note = data.note  || "";
  }

}