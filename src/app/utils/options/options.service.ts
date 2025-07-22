import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MainService } from '../main.service';
import { ConfigService } from '../config.service';
import { ErrorHandlerService } from '../error-handler.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OptionsService extends MainService {

  constructor(protected http: HttpClient,  protected override configService: ConfigService, private errorHandler: ErrorHandlerService) {super(http, configService ); }

  loadThemes(): Observable<String[]>  {
    return this.http.get<string[]>('http://localhost:3000/themes');
  }
  
  uploadTheme(file: File) {
    const formData = new FormData();
    formData.append('theme', file);
    this.http.post('http://localhost:3000/upload', formData).subscribe(() => this.loadThemes());
  }
}
