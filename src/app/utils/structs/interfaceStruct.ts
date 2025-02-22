
export class InterfaceStruct {


  constructor(
    public id: string,
    public description: string,
    public connectionType: string,
    public passiveMode: string,
    public secureFtp: string,
    public host: string,
    public port: number,
    public user: string,
    public password: string,
    public sftpAlias: string,
    public knownHost: string,
    public keyFile: string,
    public trustHost: string,
    public enabled: string,
    public note: string
  ) { }



}