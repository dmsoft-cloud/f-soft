import { Injectable } from '@angular/core';
import { catchError, map, Observable, Subject, switchMap, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

import { MainService } from '../utils/main.service';
import { ModelStruct } from '../utils/structs/modelStruct';

@Injectable({
  providedIn: 'root'
})
export class ModelService extends MainService  {

  modelChanged = new Subject<ModelStruct[]>();
    itemReload = new Subject<ModelStruct[]>();
    startedEditing = new Subject<{item: any, mode: string}>();
    manageItem = new Subject<{item: any, mode: string}>();
  
    private clearAfetrDeleteSubject = new Subject<void>(); 
    private resetAfetrUpdateSubject = new Subject<ModelStruct>(); 
    // Observable che verrà sottoscritto dai componenti che devono ascoltare l'evento
    clearAfetrDeleteObservable$ = this.clearAfetrDeleteSubject.asObservable();
    resetAfetrUpdateObservable$ = this.resetAfetrUpdateSubject.asObservable();
  
    private models: ModelStruct[] = [
    ];
    
    
    constructor(protected http: HttpClient) {
      super(http);
     }
    
    
    //metodo per ripulire il form semplificato dopo una cancellazione
    public emitClearAfetrDelete(){
      this.clearAfetrDeleteSubject.next();
    }
    
    //metodo per resettare il form semplificato dopo l'update
    public emitResetAfetrUpdate(model : ModelStruct){
      this.resetAfetrUpdateSubject.next(model);
    }
    
    
    // Metodo per recuperare i dati 
    public getModels():  Observable<ModelStruct[]> {
      return this.http.get("http://localhost:8080/models").pipe(
        map( responseData => {
          if (!Array.isArray(responseData)) {
            console.error("La risposta non è un array:", responseData);
            return [];
          }
  
          this.models = responseData.map(item => new ModelStruct(
            item.id,
            item.description || "",
            item.note || "",
            item.enabled || "",
            item.type || "",
            item.direction || "",
            item.decompression || "",
            item.compression || "",
            item.sendMail || "",
            item.retry || "",
            item.retryInterval || 0,
            item.retention || 0,
            item.internationalization || "",
            item.deleteFile || "",
            item.uniqueHash || "",
            item.fetchSize || 0,
            item.database || "",
            item.schema || "",
            item.sourceCharset || 0,
            item.destCharset || 0,
            item.fileFormat || "",
            item.header || "",
            item.recordDelimiter || "",
            item.fieldDelimiter || "",
            item.stringDelimiter || "",
            item.removingSpaces || "",
            item.numericFilling || "",
            item.integrityCheck || "",
            item.createFile || ""
          ));
          //console.log("dati ricevuti dal servizio: " + JSON.stringify(this.models));
          this.modelChanged.next(this.models.slice());
          return this.models.slice();
        }),
    
        //error
        catchError(
          errorRes => {
            console.error("Error retrieving models:", errorRes);
            return throwError(() => new Error(errorRes.error.error.message));
          }
        )
    
      );
    }
    
      public getModel(id: string): Observable<ModelStruct> {
        const url = `http://localhost:8080/models/model/${id}`;
        return this.http.get<ModelStruct>(url).pipe(
          catchError((errorRes) => {
            console.error("Error retrieving model:", errorRes);
            return throwError(() => new Error(errorRes.error.error.message));
          })
        );
      }
    
  
    addItem(item: ModelStruct) {
      
      console.log("Model trasmesso: " + JSON.stringify(item));
      const url = "http://localhost:8080/models/model";
  
      // Effettua la richiesta POST e attende la risposta
      this.http.post<ModelStruct>(url, item).pipe(
        // Utilizza l'operatore `switchMap` per passare alla chiamata `getModels` dopo che l'aggiornamento è completato
        switchMap(response => {
          console.log(response)
          return this.getModels();
        }),
        catchError(error => {
          console.error('Errore nell\'aggiornare il model:', error);
          return throwError(() => new Error(error));
        })
      ).subscribe();
    }
  
    updateItem(item: ModelStruct) {
  
        const url = "http://localhost:8080/models/model";
    
        // Effettua la richiesta POST e attende la risposta
        this.http.post<ModelStruct>(url, item).pipe(
          // Utilizza l'operatore `switchMap` per passare alla chiamata `getModels` dopo che l'aggiornamento è completato
          switchMap(response => {
            // Notifica il cambiamento della lista
            this.modelChanged.next([...this.models]);
            
            // Ritorna l'observable di `getModels` per eseguire la chiamata successiva
            return this.getModels();
          }),
          catchError(error => {
            console.error('Errore nell\'aggiornare l\'model:', error);
            return throwError(() => new Error(error));
          })
        ).subscribe();
    }
    
    deleteItem(item: ModelStruct) {
      const url = `http://localhost:8080/models/model/${item.id}`; // URL per eliminare l'elemento
      this.http.delete(url).pipe(
        // Utilizza l'operatore `switchMap` per passare alla chiamata `getModels` dopo che l'aggiornamento è completato
        switchMap(response => {
          return this.getModels();
        }),
        catchError(error => {
          console.error('Errore nella cancellazione del model:', error);
          return throwError(() => new Error(error));
        })
      ).subscribe();
    }
    
    
    getItemById(id: string): Observable<ModelStruct> {
      const url = "http://localhost:8080/models/model/${id}";
      return this.http.get<ModelStruct>(url).pipe(
        catchError((errorRes) => {
          console.error('Errore nel recuperare il model:', errorRes);
          // Restituisce un errore generico se il messaggio specifico non è disponibile
          return throwError(() => new Error(errorRes.error?.message || 'Errore sconosciuto'));
        })
      );
    }
    
}
