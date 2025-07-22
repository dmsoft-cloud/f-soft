import { Component } from '@angular/core';
import { ThemeService } from '../theme.service';
import { OptionsService } from './options.service';

@Component({
  selector: 'dms-options',
  standalone: false,
  templateUrl: './options.component.html',
  styleUrl: './options.component.css'
})
export class OptionsComponent {
  visible = false;
  selectedLanguage = 'it';
  selectedTheme = 'default-theme';
  selectedThemeFile:File ;
  themes: { name: string; type: 'default' | 'custom' }[] = [
    { name: 'default-theme.css', type: 'default' },
    { name: 'dark-theme.css', type: 'default' },
    { name: 'light-theme.css', type: 'default' }
  ];

  constructor(private themeService: ThemeService, private optionsService: OptionsService) {}

  open() {
    this.visible = true;
  }

  close() {
    this.visible = false;
  }

  applySettings() {
    console.log('Lingua:', this.selectedLanguage);
    console.log('Tema:', this.selectedTheme);
    this.themeService.loadTheme(this.selectedTheme); // <-- cambia il tema dinamicamente

    this.close();
  }


  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file?.name.endsWith('.css')) this.selectedThemeFile=file;
  }

  confirmThemeUpload() {
    if (this.selectedThemeFile?.name.endsWith('.css')) {
      // Logica per gestire l'upload effettivo
      this.optionsService.uploadTheme(this.selectedThemeFile);
    }
  }

  loadThemes() {
    this.optionsService.loadThemes().subscribe((loadedThemes: string[]) => {
      for (let theme of loadedThemes) {
        if (!this.themes.find(t => t.name === theme)) {
          this.themes.push({ name: theme, type: 'custom' });
        }
      }
    });
  }

}
