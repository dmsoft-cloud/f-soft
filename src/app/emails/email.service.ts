import { Injectable } from '@angular/core';
import { MainService } from '../utils/main.service';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../utils/config.service';
import { catchError, map, Observable, Subject, switchMap, throwError } from 'rxjs';
import { EmailStruct } from '../utils/structs/emailStruct';
import { ErrorHandlerService } from '../utils/error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class EmailService extends MainService {

  emailChanged = new Subject<EmailStruct[]>();
  itemReload = new Subject<EmailStruct[]>();
  startedEditing = new Subject<{item: any, mode: string}>();
  manageItem = new Subject<{item: any, mode: string}>();

  private clearAfetrDeleteSubject = new Subject<void>(); 
  private resetAfetrUpdateSubject = new Subject<EmailStruct>(); 
  // Observable che verrà sottoscritto dai componenti che devono ascoltare l'evento
  clearAfetrDeleteObservable$ = this.clearAfetrDeleteSubject.asObservable();
  resetAfetrUpdateObservable$ = this.resetAfetrUpdateSubject.asObservable();

  private emails: EmailStruct[] = [
  ];

  constructor(protected http: HttpClient,  protected override configService: ConfigService, private errorHandler: ErrorHandlerService ) { super(http, configService );}

        //metodo per ripulire il form semplificato dopo una cancellazione
        public emitClearAfetrDelete(){
          this.clearAfetrDeleteSubject.next();
        }
        
        //metodo per resettare il form semplificato dopo l'update
        public emitResetAfetrUpdate(email : EmailStruct){
          this.resetAfetrUpdateSubject.next(email);
        }
        
        
        // Metodo per recuperare i dati 
        public getEmails():  Observable<EmailStruct[]> {
          const apiBaseUrl = this.getApiBaseUrl();
          return this.http.get(`${apiBaseUrl}/emails`).pipe(
            map( responseData => {
              if (!Array.isArray(responseData)) {
                console.error("La risposta non è un array:", responseData);
                return [];
              }
      
              this.emails = responseData.map(item => {
                //console.log("elemento arrivato:" + JSON.stringify(item));
                return new EmailStruct(
                
                item.id,
                item.subject || "",
                item.bodyHtml || "",
                item.enabled || "",  
                item.note || "",           
                item.recipients || []
                )
              }
            );
              //console.log("dati ricevuti dal servizio: " + JSON.stringify(this.emails));
              this.emailChanged.next(this.emails.slice());
              return this.emails.slice();
            }),
        
            //error
            catchError(
              errorRes => {
                this.errorHandler.handleError(errorRes, 'Failed to load emails');
                console.error("Error retrieving emails:", errorRes);
                return throwError(() => new Error(errorRes.error.error.message));
              }
            )
        
          );
        }
        
          public getEmail(id: string): Observable<EmailStruct> {
            const apiBaseUrl = this.getApiBaseUrl();
            const url = `${apiBaseUrl}/emails/email/${id}`;
            return this.http.get<EmailStruct>(url).pipe(
              catchError((errorRes) => {
                this.errorHandler.handleError(errorRes, 'Failed to get item');
                console.error("Error retrieving email:", errorRes);
                return throwError(() => new Error(errorRes.error.error.message));
              })
            );
          }
        
      
        addItem(item: EmailStruct) {
          
          console.log("Email trasmesso: " + JSON.stringify(item));
          const apiBaseUrl = this.getApiBaseUrl();
          const url = `${apiBaseUrl}/emails/email`;
      
          // Effettua la richiesta POST e attende la risposta
          this.http.post<EmailStruct>(url, item).pipe(
            // Utilizza l'operatore `switchMap` per passare alla chiamata `getEmails` dopo che l'aggiornamento è completato
            switchMap(response => {
              console.log(response)
              return this.getEmails();
            }),
            catchError(error => {
              this.errorHandler.handleError(error, 'Failed to add item');
              console.error('Errore nell\'aggiornare il email:', error);
              return throwError(() => new Error(error));
            })
          ).subscribe();
        }
      
        updateItem(item: EmailStruct) {
            const apiBaseUrl = this.getApiBaseUrl();
            const url =`${apiBaseUrl}/emails/email`;
        
            // Effettua la richiesta POST e attende la risposta
            this.http.post<EmailStruct>(url, item).pipe(
              // Utilizza l'operatore `switchMap` per passare alla chiamata `getEmails` dopo che l'aggiornamento è completato
              switchMap(response => {
                // Notifica il cambiamento della lista
                this.emailChanged.next([...this.emails]);
                
                // Ritorna l'observable di `getEmails` per eseguire la chiamata successiva
                return this.getEmails();
              }),
              catchError(error => {
                this.errorHandler.handleError(error, 'Failed to update item');
                console.error('Errore nell\'aggiornare l\'email:', error);
                return throwError(() => new Error(error));
              })
            ).subscribe();
        }
        
        deleteItem(item: EmailStruct) {
          const apiBaseUrl = this.getApiBaseUrl();
          const url = `${apiBaseUrl}/emails/email/${item.id}`; // URL per eliminare l'elemento
          this.http.delete(url).pipe(
            // Utilizza l'operatore `switchMap` per passare alla chiamata `getEmails` dopo che l'aggiornamento è completato
            switchMap(response => {
              return this.getEmails();
            }),
            catchError(error => {
              this.errorHandler.handleError(error, 'Failed to delete item');
              console.error('Errore nella cancellazione del email:', error);
              return throwError(() => new Error(error));
            })
          ).subscribe();
        }
        
        
        getItemById(id: string): Observable<EmailStruct> {
          const apiBaseUrl = this.getApiBaseUrl();
          const url = `${apiBaseUrl}/emails/email/${id}`; 
          return this.http.get<EmailStruct>(url).pipe(
            catchError((errorRes) => {
              this.errorHandler.handleError(errorRes, 'Failed to get item');
              console.error('Errore nel recuperare il email:', errorRes);
              // Restituisce un errore generico se il messaggio specifico non è disponibile
              return throwError(() => new Error(errorRes.error?.message || 'Errore sconosciuto'));
            })
          );
        }
  

}
