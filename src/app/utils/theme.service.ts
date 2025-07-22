import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor() { }

  private themeLinkElementId = 'dynamic-theme';

  loadTheme(themeName: string): void {
    const themePath = `/assets/themes/${themeName}`;
    let themeLink = document.getElementById(this.themeLinkElementId) as HTMLLinkElement;

    if (themeLink) {
      themeLink.href = themePath;
    } else {
      themeLink = document.createElement('link');
      themeLink.id = this.themeLinkElementId;
      themeLink.rel = 'stylesheet';
      themeLink.href = themePath;
      document.head.appendChild(themeLink);
    }

    switch (themeName) {
      case 'dark-theme.css':
        document.documentElement.setAttribute('data-bs-theme', 'dark');
        break;
       case 'light-theme.css':
        document.documentElement.setAttribute('data-bs-theme', 'light');
        break;
      default:
        document.documentElement.removeAttribute('data-bs-theme');
        break;
    }
    

  }
  
}
