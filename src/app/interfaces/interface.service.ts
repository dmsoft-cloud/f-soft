import { Injectable } from '@angular/core';
import { catchError, map, Observable, Subject, switchMap, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { InterfaceStruct } from '../utils/structs/interfaceStruct';
import { MainService } from '../utils/main.service';
import { ConfigService } from '../utils/config.service';

@Injectable({
  providedIn: 'root'
})
export class InterfaceService extends MainService {

  interfaceChanged = new Subject<InterfaceStruct[]>();
  itemReload = new Subject<InterfaceStruct[]>();
  startedEditing = new Subject<{item: any, mode: string}>();
  manageItem = new Subject<{item: any, mode: string}>();

  private clearAfetrDeleteSubject = new Subject<void>(); 
  private resetAfetrUpdateSubject = new Subject<InterfaceStruct>(); 
  // Observable che verrà sottoscritto dai componenti che devono ascoltare l'evento
  clearAfetrDeleteObservable$ = this.clearAfetrDeleteSubject.asObservable();
  resetAfetrUpdateObservable$ = this.resetAfetrUpdateSubject.asObservable();

  private interfaces: InterfaceStruct[] = [
  ];

  constructor(protected http: HttpClient,  protected override configService: ConfigService ) {
          super(http, configService );
  }

  //metodo per ripulire il form semplificato dopo una cancellazione
  public emitClearAfetrDelete(){
    this.clearAfetrDeleteSubject.next();
  }
  
  //metodo per resettare il form semplificato dopo l'update
  public emitResetAfetrUpdate(interfaceItem : InterfaceStruct){
    this.resetAfetrUpdateSubject.next(interfaceItem);
  }
  

  // Metodo per recuperare i dati 
  public getInterfaces():  Observable<InterfaceStruct[]>  {
    const apiBaseUrl = this.getApiBaseUrl();
    return this.http.get(`${apiBaseUrl}/interfaces`).pipe(
      map( responseData => {
        if (!Array.isArray(responseData)) {
          console.error("La risposta non è un array:", responseData);
          return [];
        }
        this.interfaces = responseData.map(item => new InterfaceStruct(
                  item.id,
                  item.description || "",
                  item.connectionType || "",
                  item.passiveMode || "",
                  item.secureFtp || "",
                  item.host || "",
                  item.port || 0,
                  item.user || "",
                  item.password || "",
                  item.sftpAlias || "",
                  item.knownHost || "",
                  item.keyFile || "",
                  item.trustHost || "",
                  item.enabled || "",
                  item.note || "",
                ));
                //console.log("dati ricevuti dal servizio: " + JSON.stringify(this.interfaces));
                this.interfaceChanged.next([...this.interfaces]);
                return this.interfaces.slice();
      }),
      //error
      catchError(
        errorRes => {
          console.error("Error retrieving interfaces:", errorRes);
          return throwError(() => new Error(errorRes.error.error.message));
        }
      ) );
  }

  //metodo per estrarre  l'elemento della lista selezionato
  public getInterface(id: string): Observable<InterfaceStruct> {
    const apiBaseUrl = this.getApiBaseUrl();
    const url = `${apiBaseUrl}/interfaces/interface/${id}`;
    return this.http.get<InterfaceStruct>(url).pipe(
      catchError((errorRes) => {
        console.error("Error retrieving interface:", errorRes);
        return throwError(() => new Error(errorRes.error.error.message));
      })
    );
  }

    addItem(item: InterfaceStruct) {
      const apiBaseUrl = this.getApiBaseUrl();
      const url = `${apiBaseUrl}/interfaces/interface`;
      console.log("Interfaccia da inserire: ", JSON.stringify(item));
      // Effettua la richiesta POST e attende la risposta
      this.http.post<InterfaceStruct>(url, item).pipe(
          switchMap(response => {
          return this.getInterfaces();
        }),
        catchError(error => {
          console.error('Errore nell\'aggiornare l\'interfaccia:', error);
          return throwError(() => new Error(error));
        })
      ).subscribe();
    }

  
  updateItem(item: InterfaceStruct) {
      const apiBaseUrl = this.getApiBaseUrl();
      const url = `${apiBaseUrl}/interfaces/interface`;
  
      // Effettua la richiesta POST e attende la risposta
      this.http.post<InterfaceStruct>(url, item).pipe(
        // Utilizza l'operatore `switchMap` per passare alla chiamata `getOrigins` dopo che l'aggiornamento è completato
        switchMap(response => {
          // Notifica il cambiamento della lista
          this.interfaceChanged.next([...this.interfaces]);
          
          // Ritorna l'observable di `getOrigins` per eseguire la chiamata successiva
          return this.getInterfaces();
        }),
        catchError(error => {
          console.error('Errore nell\'aggiornare l\'interfaccia:', error);
          return throwError(() => new Error(error));
        })
      ).subscribe();
  }


   deleteItem(item: InterfaceStruct) {
      const apiBaseUrl = this.getApiBaseUrl();
      const url = `${apiBaseUrl}/interfaces/interface/${item.id}`; // URL per eliminare l'elemento
      this.http.delete(url).pipe(
        switchMap(response => {
          return this.getInterfaces();
        }),
        catchError(error => {
          console.error('Errore nella cancellazione dell\'interfaccia:', error);
          return throwError(() => new Error(error));
        })
      ).subscribe();
    }
  

  getItemById(id: string): Observable<InterfaceStruct> {
     const apiBaseUrl = this.getApiBaseUrl();
     const url = `${apiBaseUrl}/interfaces/interface/${id}`;
     return this.http.get<InterfaceStruct>(url).pipe(
       catchError((errorRes) => {
         console.error('Errore nel recuperare l\'interfaccia:', errorRes);
         return throwError(() => new Error(errorRes.error?.message || 'Errore sconosciuto'));
       })
     );
   }
  


}
