import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, Subject, throwError } from 'rxjs';
import { MainService } from '../utils/main.service';
import { HostStruct } from '../utils/structs/hostStruct';
import { ConfigService } from '../utils/config.service';

@Injectable({
  providedIn: 'root'
})
export class HostService extends MainService {

  hostChanged = new Subject<HostStruct[]>();
  //startedEditing = new Subject<{index: number, mode: string}>();
  startedEditing = new Subject<{item: any, mode: string}>();
  manageItem = new Subject<{item: any, mode: string}>();

  private clearAfetrDeleteSubject = new Subject<void>(); 
  private resetAfetrUpdateSubject = new Subject<HostStruct>(); 
  // Observable che verrà sottoscritto dai componenti che devono ascoltare l'evento
  clearAfetrDeleteObservable$ = this.clearAfetrDeleteSubject.asObservable();
  resetAfetrUpdateObservable$ = this.resetAfetrUpdateSubject.asObservable();


  // Metodo per recuperare i dati dei log
  /*public getHosts() {
    // Implementa qui la logica per recuperare i dati dei log, ad esempio da un server o da una fonte dati mock
    return [
      { id: 1, name: 'AS400 Prod', Remote: 'S', host: '127.0.0.1', Enabled:'S' , user: "tecprest"},
      { id: 2, name: 'AS400 test', Remote: 'S', host: 'localhost' , Enabled:'S' , user: "tecprest"},
      { id: 3, name: 'Microsoft SQL', Remote: 'N', host: 'localhost' , Enabled:'S', user: "tecprest"},
      { id: 4, name: 'PostgreSql', Remote: 'N', host: 'localhost' , Enabled:'S', user: "tecprest"},
      // Aggiungi altri dati dei log secondo necessità
    ];
  }
*/
private hosts: HostStruct[] = [
];


constructor(protected http: HttpClient,  protected override configService: ConfigService ) {
        super(http, configService );
      }


//metodo per ripulire il form semplificato dopo una cancellazione
public emitClearAfetrDelete(){
  this.clearAfetrDeleteSubject.next();
}

//metodo per resettare il form semplificato dopo l'update
public emitResetAfetrUpdate(host : HostStruct){
  this.resetAfetrUpdateSubject.next(host);
}


// Metodo per recuperare i dati 
public getHosts():  Observable<HostStruct[]> {
  // Implementa qui la logica per recuperare i dati, ad esempio da un server o da una fonte dati mock
  return this.http.get("https://dm-flow-manager-default-rtdb.europe-west1.firebasedatabase.app/hosts.json").pipe(
    map( responseData => {
        const hostsArray: HostStruct[] = [];
        console.log(responseData);
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            // Mappa ciascun elemento della risposta nel costruttore di HostStruct
            const host = new HostStruct(
              responseData[key].id,
              responseData[key].name,
              responseData[key].description,
              responseData[key].host,
              responseData[key].remote,
              responseData[key].type,
              responseData[key].status,
              responseData[key].notes
            );
            hostsArray.push(host);
          }
        }
        this.hosts=hostsArray.slice();
        this.hostChanged.next(this.hosts.slice());
        return this.hosts.slice();
        console.log(hostsArray);
      }       
    ),

    //error
    catchError(
      errorRes => {
        return throwError(() => new Error(errorRes.error.error.message));
      }
    )

  );
}

//metodo per estrarre  l'elemento della lista selezionato
public getHost(key: number){
  return this.hosts[key];
}


addItem(item: HostStruct) {
  //aggiungo l'id solo ora che non ho un vero servizio di backend
  if (this.hosts.length>0) {
    item.id = this.hosts[this.hosts.length-1].id +1
  } else {
    item.id = 1
  }
  //item.id=this.hosts.length + 1;
  this.hosts.push(item);
  this.hostChanged.next(this.hosts.slice());

  const token = this.getToken(); // Recupera il token di autenticazione
  console.log("vediamo log");
  console.log(item);
  this.http.post('https://dm-flow-manager-default-rtdb.europe-west1.firebasedatabase.app/hosts.json', item , {
        params: new HttpParams().set('auth', token) // Aggiunge il token come parametro
        }).subscribe(
    responseData => console.log(responseData)
  );
}

updateItem(item: HostStruct) {
  this.updateItemById(item);
  this.getHosts();
   
  const index = this.hosts.findIndex(host => host.id === item.id);
  if (index !== -1) {
    this.hosts[index] = item;
    this.hostChanged.next(this.hosts.slice());
  }
}

deleteItem(item: HostStruct) {
  this.deleteItemById(item.id);

  this.getHosts();

  
  const index = this.hosts.findIndex(host => host.id === item.id);
  if (index !== -1) {

    //elemento eliminato solo localmente  
    this.hosts.splice(index, 1);
    this.hostChanged.next(this.hosts.slice());
  }
  
}


getItemById(id: number): Observable<any[]> {
  return this.http.get('https://dm-flow-manager-default-rtdb.europe-west1.firebasedatabase.app/hosts.json')
    .pipe(
      map(responseData => {
        const hostsArray = [];
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key) && responseData[key].id === id) {
            hostsArray.push({ ...responseData[key], firebaseKey: key });
          }
        }
        return hostsArray;
      })
    );
}


deleteItemById(id: number): void {
  this.getItemById(id).subscribe(hosts => {
    hosts.forEach(host => {
      //console.log(host.firebaseKey) ;
      this.deleteItemByKey(host.firebaseKey).subscribe(() => {
      });
    });
  });
}

updateItemById(item: HostStruct): void {
  this.getItemById(item.id).subscribe(hosts => {
    hosts.forEach(host => {
      this.updateItemByKey(host.firebaseKey, item).subscribe(() => {});
    });
  });
}

// Metodo per eliminare un gruppo con la sua chiave Firebase
deleteItemByKey(firebaseKey: string): Observable<void> {
    const url = `https://dm-flow-manager-default-rtdb.europe-west1.firebasedatabase.app/hosts/${firebaseKey}.json`;
    return this.http.delete<void>(url);
}

// Metodo per aggiornare un gruppo con la sua chiave Firebase
updateItemByKey(firebaseKey: string, host : HostStruct): Observable<void> {
  const url = `https://dm-flow-manager-default-rtdb.europe-west1.firebasedatabase.app/hosts/${firebaseKey}.json`;
  return this.http.patch<void>(url, host);
}


}
