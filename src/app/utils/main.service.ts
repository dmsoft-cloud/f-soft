import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';



@Injectable({
  providedIn: 'root'
})
export class MainService {

  filters: any;
  
  constructor(protected http: HttpClient, protected configService: ConfigService) {}

  getToken() : string | null {
    //riconverto il json in oggetto)
    const userData :{
      email: string,
      id: string,
      _token: string
      _tokenExpirationDate: string
    } = JSON.parse(localStorage.getItem('userData'));  
    if (!userData) {
      return null;
    }
    return userData._token;
  }

  // Metodo di esempio per ottenere l'API base URL
  getApiBaseUrl(): string | undefined {
    return this.configService.getApiBaseUrl();
  }

  // Metodo di esempio per ottenere la configurazione di Google API
  getGoogleApiConfig(): { baseUrl: string, apiKey: string } | undefined {
    return this.configService.getGoogleApiConfig();
  }

  setFilters(filters : any){
    this.filters = filters;
  }

}
