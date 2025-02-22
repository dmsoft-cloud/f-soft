import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, Subject, switchMap, throwError } from 'rxjs';
import { GroupStruct } from '../utils/structs/groupStruct';
import { MainService } from '../utils/main.service';

@Injectable({
  providedIn: 'root'
})
export class GroupService extends MainService {

  groupChanged = new Subject<GroupStruct[]>();
  itemReload = new Subject<GroupStruct[]>();
  startedEditing = new Subject<{item: any, mode: string}>();
  manageItem = new Subject<{item: any, mode: string}>();

  private clearAfetrDeleteSubject = new Subject<void>(); 
  private resetAfetrUpdateSubject = new Subject<GroupStruct>(); 
  // Observable che verrà sottoscritto dai componenti che devono ascoltare l'evento
  clearAfetrDeleteObservable$ = this.clearAfetrDeleteSubject.asObservable();
  resetAfetrUpdateObservable$ = this.resetAfetrUpdateSubject.asObservable();

  private groups: GroupStruct[] = [
  ];


  constructor(protected http: HttpClient) {
    super(http);
   }


  //metodo per ripulire il form semplificato dopo una cancellazione
  public emitClearAfetrDelete(){
    this.clearAfetrDeleteSubject.next();
  }

  //metodo per resettare il form semplificato dopo l'update
  public emitResetAfetrUpdate(group : GroupStruct){
    this.resetAfetrUpdateSubject.next(group);
  }


  // Metodo per recuperare i dati 
  public getGroups():  Observable<GroupStruct[]> {
    // Implementa qui la logica per recuperare i dati, ad esempio da un server o da una fonte dati mock
    return this.http.get("http://localhost:8080/groups").pipe(
      map( responseData => {

        if (!Array.isArray(responseData)) {
          console.error("La risposta non è un array:", responseData);
          return [];
        }
        this.groups = responseData.map(item => new GroupStruct(
                  item.id,
                  item.description || "",
                  item.enabled || "",
                  item.notes || ""
                ));
        console.log("dati ricevuti dal servizio: " + JSON.stringify(this.groups));
        this.groupChanged.next([...this.groups]);
        return this.groups.slice();
              
        }),

      //error
      catchError(
        errorRes => {
          console.error("Error retrieving groups:", errorRes);
          return throwError(() => new Error(errorRes.error.error.message));
        }
      )

    );
  }

  //metodo per estrarre  l'elemento della lista selezionato
  public getGroup(id: string){
    const url = `http://localhost:8080/groups/group/${id}`;
          return this.http.get<GroupStruct>(url).pipe(
            catchError((errorRes) => {
              console.error("Error retrieving group:", errorRes);
              return throwError(() => new Error(errorRes.error.error.message));
            })
          );
  }

  
  addItem(item: GroupStruct) {
    const url = "http://localhost:8080/groups/group";

    // Effettua la richiesta POST e attende la risposta
    this.http.post<GroupStruct>(url, item).pipe(
      switchMap(response => {
        return this.getGroups();
      }),
      catchError(error => {
        console.error('Errore nell\'aggiornare l\'origin:', error);
        return throwError(() => new Error(error));
      })
    ).subscribe();
  }

  updateItem(item: GroupStruct) {
      const url = "http://localhost:8080/groups/group";
  
      // Effettua la richiesta POST e attende la risposta
      this.http.post<GroupStruct>(url, item).pipe(
          switchMap(response => {
          // Notifica il cambiamento della lista
          this.groupChanged.next([...this.groups]);
          return this.getGroups();
        }),
        catchError(error => {
          console.error('Errore nell\'aggiornare il gruppo:', error);
          return throwError(() => new Error(error));
        })
      ).subscribe();
  }

  deleteItem(item: GroupStruct) {
    const url = `http://localhost:8080/groups/group/${item.id}`; // URL per eliminare l'elemento
    this.http.delete(url).pipe(
      // Utilizza l'operatore `switchMap` per passare alla chiamata `getOrigins` dopo che l'aggiornamento è completato
      switchMap(response => {
        return this.getGroups();
      }),
      catchError(error => {
        console.error('Errore nella cancellazione del gruppo:', error);
        return throwError(() => new Error(error));
      })
    ).subscribe();
    
  }


  getItemById(id: string): Observable<GroupStruct> {
    const url = "http://localhost:8080/groups/group/${id}";
    return this.http.get<GroupStruct>(url).pipe(
      catchError((errorRes) => {
        console.error('Errore nel recuperare il gruppo:', errorRes);
        // Restituisce un errore generico se il messaggio specifico non è disponibile
        return throwError(() => new Error(errorRes.error?.message || 'Errore sconosciuto'));
      })
    );
  }
  

}
