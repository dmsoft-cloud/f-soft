import { Injectable } from '@angular/core';
import { catchError, map, Observable, Subject, switchMap, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { OriginStruct } from '../utils/structs/originStruct';
import { MainService } from '../utils/main.service';
import { ConfigService } from '../utils/config.service';
import { ErrorHandlerService } from '../utils/error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class OriginService extends MainService {

  originChanged = new Subject<OriginStruct[]>();
  itemReload = new Subject<OriginStruct[]>();
  startedEditing = new Subject<{item: any, mode: string}>();
  manageItem = new Subject<{item: any, mode: string}>();

  private clearAfetrDeleteSubject = new Subject<void>(); 
  private resetAfetrUpdateSubject = new Subject<OriginStruct>(); 
  // Observable che verrà sottoscritto dai componenti che devono ascoltare l'evento
  clearAfetrDeleteObservable$ = this.clearAfetrDeleteSubject.asObservable();
  resetAfetrUpdateObservable$ = this.resetAfetrUpdateSubject.asObservable();

  private origins: OriginStruct[] = [
  ];
  
  
  constructor(protected http: HttpClient,  protected override configService: ConfigService, private errorHandler: ErrorHandlerService ) {
          super(http, configService );
  }
  
  
  //metodo per ripulire il form semplificato dopo una cancellazione
  public emitClearAfetrDelete(){
    this.clearAfetrDeleteSubject.next();
  }
  
  //metodo per resettare il form semplificato dopo l'update
  public emitResetAfetrUpdate(origin : OriginStruct){
    this.resetAfetrUpdateSubject.next(origin);
  }
  
  
  // Metodo per recuperare i dati 
  public getOrigins():  Observable<OriginStruct[]> {
    const apiBaseUrl = this.getApiBaseUrl();
    return this.http.get(`${apiBaseUrl}/origins`).pipe(
      map( responseData => {
        if (!Array.isArray(responseData)) {
          console.error("La risposta non è un array:", responseData);
          return [];
        }

        this.origins = responseData.map(item => new OriginStruct(item ));
        //console.log("dati ricevuti dal servizio: " + JSON.stringify(this.origins));
        this.originChanged.next(this.origins.slice());
        return this.origins.slice();
      }),
  
      //error
      catchError(
        errorRes => {
          this.errorHandler.handleError(errorRes, 'Failed to load origins');
          console.error("Error retrieving origins:", errorRes);
          return throwError(() => new Error(errorRes.error.error.message));
        }
      )
  
    );
  }
  
  //metodo per estrarre  l'elemento della lista selezionato
  /*public getOrigin(key: number){
    return this.origins[key];
  }*/

    public getOrigin(id: string): Observable<OriginStruct> {
      const apiBaseUrl = this.getApiBaseUrl();
      const url = `${apiBaseUrl}/origins/origin/${id}`;
      return this.http.get<OriginStruct>(url).pipe(
        catchError((errorRes) => {
          this.errorHandler.handleError(errorRes, 'Failed to get origin');
          console.error("Error retrieving origin:", errorRes);
          return throwError(() => new Error(errorRes.error.error.message));
        })
      );
    }


  addItem(item: OriginStruct) {

    const apiBaseUrl = this.getApiBaseUrl();
    const url = `${apiBaseUrl}/origins/origin`;

    // Effettua la richiesta POST e attende la risposta
    this.http.post<OriginStruct>(url, item).pipe(
      // Utilizza l'operatore `switchMap` per passare alla chiamata `getOrigins` dopo che l'aggiornamento è completato
      switchMap(response => {
        // Notifica il cambiamento della lista
        //this.originChanged.next([...this.origins]);
        
        // Ritorna l'observable di `getOrigins` per eseguire la chiamata successiva
        return this.getOrigins();
      }),
      catchError(error => {
        this.errorHandler.handleError(error, 'Failed to add item');
        console.error('Errore nell\'aggiornare l\'origin:', error);
        return throwError(() => new Error(error));
      })
    ).subscribe();
  }

  updateItem(item: OriginStruct) {

      const apiBaseUrl = this.getApiBaseUrl();
      const url = `${apiBaseUrl}/origins/origin`;
  
      // Effettua la richiesta POST e attende la risposta
      this.http.post<OriginStruct>(url, item).pipe(
        // Utilizza l'operatore `switchMap` per passare alla chiamata `getOrigins` dopo che l'aggiornamento è completato
        switchMap(response => {
          // Notifica il cambiamento della lista
          this.originChanged.next([...this.origins]);
          
          // Ritorna l'observable di `getOrigins` per eseguire la chiamata successiva
          return this.getOrigins();
        }),
        catchError(error => {
          this.errorHandler.handleError(error, 'Failed to update item');
          console.error('Errore nell\'aggiornare l\'origin:', error);
          return throwError(() => new Error(error));
        })
      ).subscribe();
  }
  
  deleteItem(item: OriginStruct) {
    const apiBaseUrl = this.getApiBaseUrl();
    const url = `${apiBaseUrl}/origins/origin/${item.id}`;
    this.http.delete(url).pipe(
      // Utilizza l'operatore `switchMap` per passare alla chiamata `getOrigins` dopo che l'aggiornamento è completato
      switchMap(response => {
        return this.getOrigins();
      }),
      catchError(error => {
        this.errorHandler.handleError(error, 'Failed to delete item');
        console.error('Errore nella cancellazione dell\'origin:', error);
        return throwError(() => new Error(error));
      })
    ).subscribe();
  }
  
  
  getItemById(id: string): Observable<OriginStruct> {
    const apiBaseUrl = this.getApiBaseUrl();
    const url = `${apiBaseUrl}/origins/origin/${id}`;
    return this.http.get<OriginStruct>(url).pipe(
      catchError((errorRes) => {
        this.errorHandler.handleError(errorRes, 'Failed to get item');
        console.error('Errore nel recuperare l\'origin:', errorRes);
        // Restituisce un errore generico se il messaggio specifico non è disponibile
        return throwError(() => new Error(errorRes.error?.message || 'Errore sconosciuto'));
      })
    );
  }
  

}
