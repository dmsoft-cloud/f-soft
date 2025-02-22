import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

interface GoogleApiConfig {
  baseUrl: string;
  apiKey: string;
}

interface AppConfig {
  apiBaseUrl: string;
  googleApi: GoogleApiConfig;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private config: AppConfig | undefined;

  constructor(private http: HttpClient) {}

  loadConfig(): Observable<any> {
    return this.http.get('/assets/config.json').pipe(
      tap(config => this.config = config)
    );
  }


  getConfig(): AppConfig | undefined {
    return this.config;
  }

  getApiBaseUrl(): string | undefined {
    return this.config?.apiBaseUrl;
  }

  getGoogleApiConfig(): GoogleApiConfig | undefined {
    return this.config?.googleApi;
  }

  getGoogleApiBaseUrl(): string | undefined {
    return this.config?.googleApi.baseUrl;
  }

  getGoogleApiKey(): string | undefined {
    return this.config?.googleApi.apiKey;
  }

}
