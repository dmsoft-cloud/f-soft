import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StyleService {

  private heightSubject = new BehaviorSubject<string>('100vh'); // Valore iniziale
  currentHeight = this.heightSubject.asObservable();

  updateHeight(newHeight: string) {
    this.heightSubject.next(newHeight);
  }

}
