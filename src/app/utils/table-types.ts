import { DirectionEnum, YesNoEnum, TypeEnum, ConnectionTypeEnum } from './baseEntity';
import { ThemeService } from './theme.service';

export type IconResolver = (value: any) => { icon: string, class?: string, title?: string, style?: string };
export type StringResolver = (value: any) => { text: string, class?: string, title?: string, style?: string };

export interface TableTypeConfig {
  [key: string]: IconResolver | StringResolver ;
}
/*
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
  },
  connectionType: (value) => {
    switch(value) {
      case ConnectionTypeEnum.FTP:
        return { text: 'FTP', class: '', title: 'FTP' };
      case ConnectionTypeEnum.SFTP:
        return { text: 'SFTP', class: '', title: 'SFTP' };
      case ConnectionTypeEnum.SCP:
        return { text: 'SCP', class: '', title: 'SCP' };
      case ConnectionTypeEnum.SMTP:
        return { text: 'SMTP', class: '', title: 'SMTP' };
      case ConnectionTypeEnum.IMAP:
        return { text: 'IMAP', class: '', title: 'IMAP' };
    }
  }

};
*/

  /************************************************************************/
  /*                   test css dark                                      */
  /************************************************************************/


export function getDefaultTableTypes() {
  const isDark = EntityUtils.isDarkTheme();

  return {
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
          return { icon: 'bi-reply', class: isDark ? 'text-light' : 'text-dark', title: 'Outbound', style: 'transform: scaleX(-1);' };
        default:
          return { icon: 'bi-question-left', class: 'text-success', title: 'Unknown direction', style: '' };
      }
    },
    typeFlow: (value) => {
      switch(value) {
        case TypeEnum.ORIGIN:
          return { icon: 'bi-database', class: isDark ? 'text-light' : 'text-dark', title: 'Database' };
        case TypeEnum.FILESYSTEM:
          return { icon: 'bi-folder', class: isDark ? 'text-light' : 'text-dark', title: 'Filesystem' };
        default:
          return { icon: 'bi-question-circle', class: 'text-secondary', title: 'Unknown type' };
      }
    },
    connectionType: (value) => {
      switch(value) {
        case ConnectionTypeEnum.FTP:
          return { text: 'FTP', class: '', title: 'FTP' };
        case ConnectionTypeEnum.SFTP:
          return { text: 'SFTP', class: '', title: 'SFTP' };
        case ConnectionTypeEnum.SCP:
          return { text: 'SCP', class: '', title: 'SCP' };
        case ConnectionTypeEnum.SMTP:
          return { text: 'SMTP', class: '', title: 'SMTP' };
        case ConnectionTypeEnum.IMAP:
          return { text: 'IMAP', class: '', title: 'IMAP' };
      }
    }
  };
}




// Estensione di EntityUtils
export class EntityUtils {

  static isDarkTheme(): boolean {
    return document.documentElement.getAttribute('data-bs-theme') === 'dark';
  }

  static getBooleanValueYesNo(value: any): boolean {
    return value === YesNoEnum.YES || value === true || value === 'true' || value === 'S';
  }

  static resolveTableIcon(type: string, value: any, themeService: ThemeService,
         customTypes: TableTypeConfig = {}): { icon: string, class?: string, title?: string } |
            { text: string, class?: string, title?: string }
    {
    const defaultTypes = getDefaultTableTypes();
    //const allTypes = { ...DEFAULT_TABLE_TYPES, ...customTypes };
     const allTypes = { ...defaultTypes, ...customTypes };
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