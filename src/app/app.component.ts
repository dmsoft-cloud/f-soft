import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';
import { ConfigService } from './utils/config.service';
import { StyleService } from './utils/style.service';

@Component({
  selector: 'dms-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'f-Soft-app';
  containerHeight = '100vh';
  isAuth : boolean = false;
  toolBarSubscription : Subscription;

  apiBaseUrl: string | undefined;
  googleApiConfig: { baseUrl: string, apiKey: string } | undefined;

  constructor(private authService : AuthService, private router : Router, private configService: ConfigService, private styleService: StyleService){}

  ngOnInit(): void {
    this.apiBaseUrl = this.configService.getApiBaseUrl();
    this.googleApiConfig = this.configService.getGoogleApiConfig();

    this.styleService.currentHeight.subscribe((height) => {
      this.containerHeight = height;
    });
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

}
