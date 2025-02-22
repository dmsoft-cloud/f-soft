import { Injectable } from '@angular/core';
import { catchError, map, Observable, Subject, switchMap, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { OriginStruct } from '../utils/structs/originStruct';
import { MainService } from '../utils/main.service';

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
  
  
  constructor(protected http: HttpClient) {
    super(http);
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
    return this.http.get("http://localhost:8080/origins").pipe(
      map( responseData => {
        if (!Array.isArray(responseData)) {
          console.error("La risposta non è un array:", responseData);
          return [];
        }

        this.origins = responseData.map(item => new OriginStruct(
          item.id,
          item.dbType || "",
          item.description || "",
          item.enabled || "",
          item.ip || "",
          item.jdbcCustomString || "",
          item.note || "",
          item.password || "",
          item.port || 0,
          item.secure || "",
          item.user || ""
        ));
        //console.log("dati ricevuti dal servizio: " + JSON.stringify(this.origins));
        this.originChanged.next(this.origins.slice());
        return this.origins.slice();
      }),
  
      //error
      catchError(
        errorRes => {
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
      const url = `http://localhost:8080/origins/origin/${id}`;
      return this.http.get<OriginStruct>(url).pipe(
        catchError((errorRes) => {
          console.error("Error retrieving origin:", errorRes);
          return throwError(() => new Error(errorRes.error.error.message));
        })
      );
    }
  
/*
  addItem(item: OriginStruct)  {
    const token = this.getToken();
    const url = "http://localhost:8080/origins/origin";
    console.log("valore form da inserire: " + JSON.stringify(item));

    // Effettua la richiesta POST e attende la risposta
    this.http.post<OriginStruct>(url, item).subscribe({
      next: (response) => {
        this.origins.push(response); // Aggiunge l'elemento alla lista
        this.originChanged.next([...this.origins]);  // Notifica il cambiamento della lista
      },
      error: (error) => {
        console.error('Errore nell\'aggiungere l\'origin:', error); // Gestisce l'errore
      }
    });
  }
    */

  addItem(item: OriginStruct) {

    const url = "http://localhost:8080/origins/origin";

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
        console.error('Errore nell\'aggiornare l\'origin:', error);
        return throwError(() => new Error(error));
      })
    ).subscribe();
  }

  updateItem(item: OriginStruct) {

      const url = "http://localhost:8080/origins/origin";
  
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
          console.error('Errore nell\'aggiornare l\'origin:', error);
          return throwError(() => new Error(error));
        })
      ).subscribe();
  }
  
  deleteItem(item: OriginStruct) {
    const url = `http://localhost:8080/origins/origin/${item.id}`; // URL per eliminare l'elemento
    this.http.delete(url).pipe(
      // Utilizza l'operatore `switchMap` per passare alla chiamata `getOrigins` dopo che l'aggiornamento è completato
      switchMap(response => {
        return this.getOrigins();
      }),
      catchError(error => {
        console.error('Errore nella cancellazione dell\'origin:', error);
        return throwError(() => new Error(error));
      })
    ).subscribe();
  }
  
  
  getItemById(id: string): Observable<OriginStruct> {
    const url = "http://localhost:8080/origins/origin/${id}";
    return this.http.get<OriginStruct>(url).pipe(
      catchError((errorRes) => {
        console.error('Errore nel recuperare l\'origin:', errorRes);
        // Restituisce un errore generico se il messaggio specifico non è disponibile
        return throwError(() => new Error(errorRes.error?.message || 'Errore sconosciuto'));
      })
    );
  }
  

}
