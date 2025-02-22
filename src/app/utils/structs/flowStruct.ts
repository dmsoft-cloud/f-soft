export class FlowStruct {


  constructor(
    public id: string,
    public description: string,
    public groupId: string,
    public note: string,
    public enabled: string,
    public model: string,
    public origin: string, 
    public interfaceId: string,
    public notificationFlow: string,
    public notificationOk: string,
    public notificationKo: string,
    public integrityFileName: string,
    public dbTable: string,
    public folder: string,
    public file: string,
    public remoteFolder: string,
    public remoteFile: string,
    public lengthFixed: number
  ) { }


}