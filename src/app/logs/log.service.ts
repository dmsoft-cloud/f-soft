import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor() { }

  // Metodo per recuperare i dati dei log
  public getLogs() {
    // Implementa qui la logica per recuperare i dati dei log, ad esempio da un server o da una fonte dati mock
    return [
      { id: 1, host: 'Host 1', id_flusso: 101, esito: 'Successo', timestamp_inizio: '2024-04-25T09:00:00', timestamp_fine: '2024-04-25T09:30:00' },
      { id: 2, host: 'Host 2', id_flusso: 102, esito: 'Fallimento', timestamp_inizio: '2024-04-25T10:00:00', timestamp_fine: '2024-04-25T10:15:00' },
      // Aggiungi altri dati dei log secondo necessità
    ];
  }
}
