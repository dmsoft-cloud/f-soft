import { Injectable } from '@angular/core';
import { LogStruct } from '../utils/structs/logStruct';
import { catchError, map, Observable, Subject, throwError } from 'rxjs';
import { MainService } from '../utils/main.service';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../utils/config.service';
import { ErrorHandlerService } from '../utils/error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class LogService extends MainService  {

  logChanged = new Subject<LogStruct[]>();
  itemReload = new Subject<LogStruct[]>();
  manageItem = new Subject<{item: any, mode: string}>();

  private clearAfetrDeleteSubject = new Subject<void>(); 
  private resetAfetrUpdateSubject = new Subject<LogStruct>(); 
  // Observable che verrà sottoscritto dai componenti che devono ascoltare l'evento
  clearAfetrDeleteObservable$ = this.clearAfetrDeleteSubject.asObservable();
  resetAfetrUpdateObservable$ = this.resetAfetrUpdateSubject.asObservable();
  
  private logs: LogStruct[] = [];

  constructor(protected http: HttpClient,  protected override configService: ConfigService, private errorHandler: ErrorHandlerService ) {
          super(http, configService );
  }

  // Metodo per recuperare i dati dei log
  public getLogs() :  Observable<LogStruct[]>  {
       const apiBaseUrl = this.getApiBaseUrl();
       return this.http.get(`${apiBaseUrl}/flowLogs`).pipe(
         map( responseData => {
           if (!Array.isArray(responseData)) {
             console.error("La risposta non è un array:", responseData);
             return [];
           }
           this.logs = responseData.map(item => new LogStruct(item));                     
           //console.log("dati ricevuti dal servizio: " + JSON.stringify(this.interfaces));
           this.logChanged.next([...this.logs]);
           return this.logs.slice();
         }),
         //error
         catchError(
           errorRes => {
             this.errorHandler.handleError(errorRes, 'Failed to load interfaces');
             console.error("Error retrieving interfaces:", errorRes);
             return throwError(() => new Error(errorRes.error.error.message));
           }
         ) );
    }


    //metodo per estrarre  l'elemento della lista selezionato
    public getLog(id: string): Observable<LogStruct> {
      const apiBaseUrl = this.getApiBaseUrl();
      const url = `${apiBaseUrl}/flowLogs/flowLog/${id}`;
      return this.http.get<LogStruct>(url).pipe(
        catchError((errorRes) => {
          this.errorHandler.handleError(errorRes, 'Failed to get item');
          console.error("Error retrieving log item:", errorRes);
          return throwError(() => new Error(errorRes.error.error.message));
        })
      );
    }
   
}
