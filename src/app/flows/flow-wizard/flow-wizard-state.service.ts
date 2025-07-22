import { Injectable } from '@angular/core';
import { GroupStruct } from '../../utils/structs/groupStruct';
import { ModelStruct } from '../../utils/structs/modelStruct';
import { OriginStruct } from '../../utils/structs/originStruct';
import { InterfaceStruct } from '../../utils/structs/interfaceStruct';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FlowWizardStateService {

  private state = {
    group: null as GroupStruct  | null,
    model: null as ModelStruct | null,
    origin: null as OriginStruct | null,
    interface: null as InterfaceStruct | null
  };

  private stateSubject = new BehaviorSubject(this.state);
  state$ = this.stateSubject.asObservable();

  // Metodi di utilità generici
  // metodo generico che accetta come chiavi solo le chiavi di state ae come valore un valore generico
  updateState<T>(key: keyof typeof this.state, value: T) {
    this.state = { ...this.state, [key]: value };
    this.stateSubject.next(this.state);
  }

  getStateValue<T>(key: keyof typeof this.state): T | null {
    return this.state[key] as T;
  }

  resetState() {
    this.state = {
      group: null,
      model: null,
      origin: null,
      interface: null
    };
    this.stateSubject.next(this.state);
  }


}
