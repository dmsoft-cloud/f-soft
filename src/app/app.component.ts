import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';
import { ConfigService } from './utils/config.service';
import { StyleService } from './utils/style.service';
import { ThemeService } from './utils/theme.service';
import { OptionsComponent } from './utils/options/options.component';

@Component({
    selector: 'dms-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    standalone: false
})
export class AppComponent implements OnInit{
  title = 'f-Soft-app';
  containerHeight = '100vh';
  isAuth : boolean = false;
  toolBarSubscription : Subscription;
  @ViewChild('optionsPanel') optionsPanel!: OptionsComponent;

  apiBaseUrl: string | undefined;
  googleApiConfig: { baseUrl: string, apiKey: string } | undefined;

  constructor(private authService : AuthService, private router : Router, private configService: ConfigService, private styleService: StyleService, private themeService: ThemeService ){}

  ngOnInit(): void {
    this.apiBaseUrl = this.configService.getApiBaseUrl();
    this.googleApiConfig = this.configService.getGoogleApiConfig();

    this.styleService.currentHeight.subscribe((height) => {
      this.containerHeight = height;
    });

    const user = JSON.parse(localStorage.getItem('userData') || '{}');
    const userTheme = user.theme || 'default-theme.css';
    this.themeService.loadTheme(userTheme);

    /*
    console.log('API Base URL:', this.apiBaseUrl);
    console.log('Google API Config:', this.googleApiConfig);
    console.log('parametro1: ' , this.googleApiConfig.apiKey );
    console.log('parametro2: ' , this.googleApiConfig.baseUrl );
    */
    const isLogged = this.authService.autoLogin();
    if(!isLogged){
      this.router.navigate(['./auth']);
    }
    
  }
 
  

  onNavigate(activeAuth: boolean) {
    //console.log(activeAuth)
    this.isAuth = activeAuth;
  }

  //per apertura pannello opzioni
  openOptionsPanel() {
    this.optionsPanel.open();
  }

}
