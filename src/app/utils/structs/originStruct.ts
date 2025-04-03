import { AuditlogStruct } from "./auditlogStruct";

export class OriginStruct  extends AuditlogStruct  {

  public id: string;
  public dbType: string
  public description: string;
  public enabled: string;
  public ip: string;
  public jdbcCustomString: string;
  public note: string;
  public password: string;
  public port:  number;
  public secure: string;
  public user: string;



  constructor(data: Partial<OriginStruct> = {}) {
    super(data);
    this.id = data.id || "";
    this.dbType = data.dbType || "";
    this.description = data.description || "";
    this.enabled = data.enabled || "";
    this.ip = data.ip || "";
    this.jdbcCustomString = data.jdbcCustomString || "";
    this.note = data.note || "";
    this.password = data.password || "";
    this.port = data.port || 0;
    this.secure = data.secure || "";
    this.user = data.user || "";

   }



}