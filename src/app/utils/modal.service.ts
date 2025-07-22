import { Injectable, Type } from '@angular/core';
import { IEditComponent } from './interfaces/gereric-edit.interface';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private ngbModal: NgbModal) {}

  openEditModal<T extends IEditComponent>(
    componentType: Type<T>,
    data: any,
    mode: string,
    options?: {
      size?: 'sm' | 'lg' | 'xl';
      backdrop?: boolean | 'static';
      windowClass?: string;
      componentDescription?: string;
    }
  ): NgbModalRef {
    const modalRef = this.ngbModal.open(componentType, {
      size: options?.size || 'xl',
      backdrop: options?.backdrop || 'static',
      windowClass: options?.windowClass || 'dms-modal'
    });

    const componentInstance = modalRef.componentInstance as T;
    if (options?.componentDescription) {
      componentInstance.componentDescription = options.componentDescription;
    }
    
    // Inizializza il componente con i dati
    componentInstance.initializeWithData(data, mode);

    return modalRef;
  }
}
