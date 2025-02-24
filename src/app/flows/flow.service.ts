import { Injectable } from '@angular/core';
import { catchError, map, Observable, Subject, switchMap, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

import { MainService } from '../utils/main.service';
import { FlowStruct } from '../utils/structs/flowStruct';
import { ConfigService } from '../utils/config.service';

@Injectable({
  providedIn: 'root'
})
export class FlowService extends MainService  {

    flowChanged = new Subject<FlowStruct[]>();
      itemReload = new Subject<FlowStruct[]>();
      startedEditing = new Subject<{item: any, mode: string}>();
      manageItem = new Subject<{item: any, mode: string}>();
    
      private clearAfetrDeleteSubject = new Subject<void>(); 
      private resetAfetrUpdateSubject = new Subject<FlowStruct>(); 
      // Observable che verrà sottoscritto dai componenti che devono ascoltare l'evento
      clearAfetrDeleteObservable$ = this.clearAfetrDeleteSubject.asObservable();
      resetAfetrUpdateObservable$ = this.resetAfetrUpdateSubject.asObservable();
    
      private flows: FlowStruct[] = [
      ];
      
      
      constructor(protected http: HttpClient,  protected override configService: ConfigService ) {
        super(http, configService );
      }
      
      
      //metodo per ripulire il form semplificato dopo una cancellazione
      public emitClearAfetrDelete(){
        this.clearAfetrDeleteSubject.next();
      }
      
      //metodo per resettare il form semplificato dopo l'update
      public emitResetAfetrUpdate(flow : FlowStruct){
        this.resetAfetrUpdateSubject.next(flow);
      }
      
      
      // Metodo per recuperare i dati 
      public getFlows():  Observable<FlowStruct[]> {
        const apiBaseUrl = this.getApiBaseUrl();
        return this.http.get(`${apiBaseUrl}/flows`).pipe(
          map( responseData => {
            if (!Array.isArray(responseData)) {
              console.error("La risposta non è un array:", responseData);
              return [];
            }
    
            this.flows = responseData.map(item => new FlowStruct(
              item.id,
              item.description || "",
              item.groupId || "",
              item.note || "",
              item.enabled || "",
              item.model || "",
              item.origin || "",
              item.interfaceId || "",
              item.notificationFlow || "",
              item.notificationOk || "",
              item.notificationKo || "",
              item.integrityFileName || "",
              item.dbTable || "",
              item.folder || "",
              item.file || "",
              item.remoteFolder || "",
              item.remoteFile || "",
              item.lengthFixed || 0             
            ));
            //console.log("dati ricevuti dal servizio: " + JSON.stringify(this.flows));
            this.flowChanged.next(this.flows.slice());
            return this.flows.slice();
          }),
      
          //error
          catchError(
            errorRes => {
              console.error("Error retrieving flows:", errorRes);
              return throwError(() => new Error(errorRes.error.error.message));
            }
          )
      
        );
      }
      
        public getFlow(id: string): Observable<FlowStruct> {
          const apiBaseUrl = this.getApiBaseUrl();
          const url = `${apiBaseUrl}/flows/flow/${id}`;
          return this.http.get<FlowStruct>(url).pipe(
            catchError((errorRes) => {
              console.error("Error retrieving flow:", errorRes);
              return throwError(() => new Error(errorRes.error.error.message));
            })
          );
        }
      
    
      addItem(item: FlowStruct) {
        
        console.log("Flow trasmesso: " + JSON.stringify(item));
        const apiBaseUrl = this.getApiBaseUrl();
        const url = `${apiBaseUrl}/flows/flow`;
    
        // Effettua la richiesta POST e attende la risposta
        this.http.post<FlowStruct>(url, item).pipe(
          // Utilizza l'operatore `switchMap` per passare alla chiamata `getFlows` dopo che l'aggiornamento è completato
          switchMap(response => {
            console.log(response)
            return this.getFlows();
          }),
          catchError(error => {
            console.error('Errore nell\'aggiornare il flow:', error);
            return throwError(() => new Error(error));
          })
        ).subscribe();
      }
    
      updateItem(item: FlowStruct) {
          const apiBaseUrl = this.getApiBaseUrl();
          const url =`${apiBaseUrl}/flows/flow`;
      
          // Effettua la richiesta POST e attende la risposta
          this.http.post<FlowStruct>(url, item).pipe(
            // Utilizza l'operatore `switchMap` per passare alla chiamata `getFlows` dopo che l'aggiornamento è completato
            switchMap(response => {
              // Notifica il cambiamento della lista
              this.flowChanged.next([...this.flows]);
              
              // Ritorna l'observable di `getFlows` per eseguire la chiamata successiva
              return this.getFlows();
            }),
            catchError(error => {
              console.error('Errore nell\'aggiornare l\'flow:', error);
              return throwError(() => new Error(error));
            })
          ).subscribe();
      }
      
      deleteItem(item: FlowStruct) {
        const apiBaseUrl = this.getApiBaseUrl();
        const url = `${apiBaseUrl}/flows/flow/${item.id}`; // URL per eliminare l'elemento
        this.http.delete(url).pipe(
          // Utilizza l'operatore `switchMap` per passare alla chiamata `getFlows` dopo che l'aggiornamento è completato
          switchMap(response => {
            return this.getFlows();
          }),
          catchError(error => {
            console.error('Errore nella cancellazione del flow:', error);
            return throwError(() => new Error(error));
          })
        ).subscribe();
      }
      
      
      getItemById(id: string): Observable<FlowStruct> {
        const apiBaseUrl = this.getApiBaseUrl();
        const url = `${apiBaseUrl}/flows/flow/${id}`; 
        return this.http.get<FlowStruct>(url).pipe(
          catchError((errorRes) => {
            console.error('Errore nel recuperare il flow:', errorRes);
            // Restituisce un errore generico se il messaggio specifico non è disponibile
            return throwError(() => new Error(errorRes.error?.message || 'Errore sconosciuto'));
          })
        );
      }
  
}
