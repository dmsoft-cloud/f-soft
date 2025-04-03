import { AuditlogStruct } from "./auditlogStruct";

export class ModelStruct  extends AuditlogStruct {

  public  id : string;
  public  description : string;
  public  note : string;
  public  enabled : string;
  public  type : string;
  public  direction : string;
  public  decompression : string;
  public  compression : string;
  public  sendMail : string;
  public  retry : string;
  public  retryInterval : string;
  public  retention : number;
  public  internationalization : string;
  public  deleteFile : string;
  public  uniqueHash : string;
  public  fetchSize : number;
  public  database : string;
  public  schema : string;
  public  sourceCharset : number;
  public  destCharset : number;
  public fileFormat : string;
  public  header : string;
  public  recordDelimiter : string;
  public  fieldDelimiter : string;
  public  stringDelimiter : string;
  public  removingSpaces : string;
  public  numericFilling : string;
  public  integrityCheck : string;
  public  createFile : string;

  constructor(data: Partial<ModelStruct> = {}) {
    super(data);
    this.id = data.id || "";
    this.description = data.description || "";
    this.note = data.note || "";
    this.enabled = data.enabled || "";
    this.type = data.type || "";
    this.direction = data.direction || "";
    this.decompression = data.decompression  || "";
    this.compression = data.compression || "";
    this.sendMail = data.sendMail || "";
    this.retry = data.retry || "";
    this.retryInterval = data.retryInterval || "";
    this.retention = data.retention || 0;
    this.internationalization = data.internationalization || "";
    this.deleteFile = data.deleteFile || "";
    this.uniqueHash = data.uniqueHash || "";
    this.fetchSize = data.fetchSize || 0;
    this.database = data.database || "";
    this.schema = data.schema || "";
    this.sourceCharset = data.sourceCharset || 0;
    this.destCharset = data.destCharset || 0;
    this.fileFormat = data.fileFormat || "";
    this.header = data.header || "";
    this.recordDelimiter = data.recordDelimiter || "";
    this.fieldDelimiter = data.fieldDelimiter || "";
    this.stringDelimiter = data.stringDelimiter || "";
    this.removingSpaces = data.removingSpaces || "";
    this.numericFilling = data.numericFilling || "";
    this.integrityCheck = data.integrityCheck || "";
    this.createFile = data.createFile || ""; 
   }


}