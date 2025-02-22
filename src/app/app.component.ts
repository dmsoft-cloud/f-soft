import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';
import { ConfigService } from './utils/config.service';

@Component({
  selector: 'dms-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'f-Soft-app';
  isAuth : boolean = false;
  toolBarSubscription : Subscription;

  apiBaseUrl: string | undefined;
  googleApiConfig: { baseUrl: string, apiKey: string } | undefined;

  constructor(private authService : AuthService, private router : Router, private configService: ConfigService){}

  ngOnInit(): void {
    this.apiBaseUrl = this.configService.getApiBaseUrl();
    this.googleApiConfig = this.configService.getGoogleApiConfig();
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
