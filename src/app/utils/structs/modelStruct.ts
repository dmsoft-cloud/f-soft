
export class ModelStruct {

  constructor(
    public  id : string,
    public  description : string,
    public  note : string,
    public  enabled : string,
    public  type : string,
    public  direction : string,
    public  decompression : string,
    public  compression : string,
    public  sendMail : string,
    public  retry : string,
    public  retryInterval : string,
    public  retention : number,
    public  internationalization : string,
    public  deleteFile : string,
    public  uniqueHash : string,
    public  fetchSize : number,
    public  database : string,
    public  schema : string,
    public  sourceCharset : number,
    public  destCharset : number,
    public fileFormat : string,
    public  header : string,
    public  recordDelimiter : string,
    public  fieldDelimiter : string,
    public  stringDelimiter : string,
    public  removingSpaces : string,
    public  numericFilling : string,
    public  integrityCheck : string,
    public  createFile : string
  ) { }



}