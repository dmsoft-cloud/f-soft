// error-handler.service.ts
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  private errorSubject = new Subject<string>();

  constructor(private messageService: MessageService) {}

  // Metodo per gestire gli errori
  handleError(error: any, customMessage?: string) {
    let errorMessage = customMessage || 'An error occurred';
    
    if (error instanceof HttpErrorResponse) {
      // Errore HTTP
      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.status === 0) {
        errorMessage = 'Unable to connect to server';
      } else {
        errorMessage = `Server returned code ${error.status}`;
      }
    } else if (error instanceof Error) {
      // Errore JavaScript standard
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      // Stringa di errore
      errorMessage = error;
    }

    // Emetti l'errore e mostra il toast
    this.errorSubject.next(errorMessage);
    this.showErrorToast(errorMessage);
    
    // Log in console per debug
    console.error('ErrorHandlerService:', error);
  }

  // Mostra toast di errore
  private showErrorToast(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 5000, // 5 secondi
      styleClass: 'custom-error-toast' // Classe CSS personalizzata
    });
  }

  // Observable per chi vuole ascoltare gli errori
  get errors$() {
    return this.errorSubject.asObservable();
  }
}
