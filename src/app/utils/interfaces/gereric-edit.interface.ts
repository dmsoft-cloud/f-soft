import { EventEmitter } from "@angular/core";

export interface IEditComponent<T = any> {
    initializeWithData(data: T | null, mode: string): void;
    resetForm(): void;
    getFormValue(): T;
    isValid(): boolean;
    
    // Proprietà comuni
    componentDescription: string;
    closeModal: EventEmitter<void>;
    isEditEnabled: boolean;
  }