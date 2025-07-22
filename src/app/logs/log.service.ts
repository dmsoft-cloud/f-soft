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
      { id: 1, host: 'Host 1', id_flusso: 'TEST_FLOW1' , esito: 'Success', timestamp_inizio: '2024-04-25T09:00:00', timestamp_fine: '2024-04-25T09:30:00' },
      { id: 2, host: 'Host 2', id_flusso: 102, esito: 'Success', timestamp_inizio: '2024-04-25T10:00:00', timestamp_fine: '2024-04-25T10:15:00' },
      { id: 3, host: 'Host 2', id_flusso: 102, esito: 'Success', timestamp_inizio: '2024-04-25T10:00:00', timestamp_fine: '2024-04-25T10:15:00' },
      { id: 4, host: 'Host 2', id_flusso: 'TEST_FLOW1', esito: 'Success', timestamp_inizio: '2024-04-25T10:00:00', timestamp_fine: '2024-04-25T10:15:00' },
      { id: 5, host: 'Host 2', id_flusso: 102, esito: 'Success', timestamp_inizio: '2024-04-25T10:00:00', timestamp_fine: '2024-04-25T10:15:00' },
      { id: 6, host: 'Host 2', id_flusso: 'TEST_FLOW1', esito: 'Success', timestamp_inizio: '2024-04-25T10:00:00', timestamp_fine: '2024-04-25T10:15:00' },
      { id: 7, host: 'Host 2', id_flusso: 102, esito: 'Success', timestamp_inizio: '2024-04-25T10:00:00', timestamp_fine: '2024-04-25T10:15:00' },
      { id: 8, host: 'Host 2', id_flusso: 102, esito: 'Faild', timestamp_inizio: '2024-04-25T10:00:00', timestamp_fine: '2024-04-25T10:15:00' },
      { id: 9, host: 'Host 2', id_flusso: 'TEST_FLOW1', esito: 'Success', timestamp_inizio: '2024-04-25T10:00:00', timestamp_fine: '2024-04-25T10:15:00' },
      { id: 10, host: 'Host 2', id_flusso: 102, esito: 'Faild', timestamp_inizio: '2024-04-25T10:00:00', timestamp_fine: '2024-04-25T10:15:00' },
      { id: 11, host: 'Host 2', id_flusso: 'TEST_FLOW1', esito: 'Faild', timestamp_inizio: '2024-04-25T10:00:00', timestamp_fine: '2024-04-25T10:15:00' },
      { id: 12, host: 'Host 2', id_flusso: 'TEST_FLOW1', esito: 'Faild', timestamp_inizio: '2024-04-25T10:00:00', timestamp_fine: '2024-04-25T10:15:00' },
      { id: 13, host: 'Host 2', id_flusso: 'TEST_FLOW1', esito: 'Success', timestamp_inizio: '2024-04-25T10:00:00', timestamp_fine: '2024-04-25T10:15:00' },
      { id: 14, host: 'Host 2', id_flusso: 102, esito: 'Success', timestamp_inizio: '2024-04-25T10:00:00', timestamp_fine: '2024-04-25T10:15:00' },
      { id: 15, host: 'Host 2', id_flusso: 102, esito: 'Success', timestamp_inizio: '2024-04-25T10:00:00', timestamp_fine: '2024-04-25T10:15:00' },
      { id: 16, host: 'Host 2', id_flusso: 102, esito: 'Faild', timestamp_inizio: '2024-04-25T10:00:00', timestamp_fine: '2024-04-25T10:15:00' },

      // Aggiungi altri dati dei log secondo necessità
    ];
  }
}
