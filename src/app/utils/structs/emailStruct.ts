export class EmailStruct {


  constructor(
    public id: string,
    public subject: string,
    public bodyHtml: string,
    public enabled: string,
    public note: string,
    public recipients: { emailId: string; emailAddress: string; type: string }[] = []
  ) { }


}