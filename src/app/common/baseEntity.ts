
export enum YesNo {
    YES = "YES",
    NO = "NO",
    S = "S",
    N = "N",
    Y="Y"
  }


export enum TypeFlow {
    ORIGIN = 'D',
    FILESYSTEM = 'I'
  }

export class EntityUtils {

  public static getBooleanValueYesNo(value: string): boolean {
    return value === YesNo.YES || value === YesNo.S || value === YesNo.Y;
  }


}
