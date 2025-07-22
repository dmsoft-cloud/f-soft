import { DirectionEnum, YesNoEnum, TypeEnum } from './baseEntity';

export type IconResolver = (value: any) => { icon: string, class?: string, title?: string, style?: string };

export interface TableTypeConfig {
  [key: string]: IconResolver;
}

export const DEFAULT_TABLE_TYPES: TableTypeConfig = {
  enabled: (value) => ({
    icon: EntityUtils.getBooleanValueYesNo(value) ? 'bi-check-lg' : 'bi-x-lg',
    class: EntityUtils.getBooleanValueYesNo(value) ? 'text-success' : 'text-danger',
    title: EntityUtils.getBooleanValueYesNo(value) ? 'Enabled' : 'Disabled'
  }),
  direction: (value) => {
    switch(value) {
      case DirectionEnum.INBOUND:
        return { icon: 'bi-reply', class: 'text-primary', title: 'Inbound', style: '' };
      case DirectionEnum.OUTBOUND:
        return { icon: 'bi-reply', class: 'text-dark', title: 'Outbound', style: 'transform: scaleX(-1);' };
      default:
        return { icon: 'bi-question-left', class: 'text-success', title: 'Unknown direction', style: '' };
    }
  },
  typeFlow: (value) => {
    switch(value) {
      case TypeEnum.ORIGIN:
        return { icon: 'bi-database', class: 'text-dark', title: 'Database' };
      case TypeEnum.FILESYSTEM:
        return { icon: 'bi-folder', class: 'text-dark', title: 'Filesystem' };
      default:
        return { icon: 'bi-question-circle', class: 'text-secondary', title: 'Unknown type' };
    }
  }
};

// Estensione di EntityUtils
export class EntityUtils {
  static getBooleanValueYesNo(value: any): boolean {
    return value === YesNoEnum.YES || value === true || value === 'true' || value === 'S';
  }

  static resolveTableIcon(type: string, value: any, customTypes: TableTypeConfig = {}): { icon: string, class?: string, title?: string } {
    const allTypes = { ...DEFAULT_TABLE_TYPES, ...customTypes };
    const resolver = allTypes[type];
    
    if (resolver) {
      return resolver(value);
    }
    
    return { 
      icon: 'bi-question-circle',
      class: 'text-secondary',
      title: value?.toString() || ''
    };
  }
}