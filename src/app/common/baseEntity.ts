import { getDefaultTableTypes, TableTypeConfig } from "../utils/table-types";

export enum YesNo {
    YES = "YES",
    NO = "NO",
    S = "S",
    N = "N",
    Y="Y"
  }



export class EntityUtils {

  public static getBooleanValueYesNo(value: string): boolean {
      return value === YesNo.YES || value === YesNo.S || value === YesNo.Y;
  } 

  static resolveTableIcon(type: string, value: any, customTypes: TableTypeConfig = {}): { icon: string, class?: string, title?: string } |
              { text: string, class?: string, title?: string }
    {

    // Combina i tipi predefiniti con quelli custom (i custom hanno precedenza)
    
    const defaultTypes = getDefaultTableTypes();
        //const allTypes = { ...DEFAULT_TABLE_TYPES, ...customTypes };
    const allTypes = { ...defaultTypes, ...customTypes };
    const resolver = allTypes[type];
    
    if (resolver) {
      return resolver(value);
    }
    
    // Default fallback
    return { 
      icon: 'bi-question-circle',
      class: 'text-secondary',
      title: value?.toString() || ''
    };
  }



}
