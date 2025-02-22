import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { DefaultTableComponent } from '../../utils/default-table/default-table.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, tap } from 'rxjs';
import { ModelStruct } from '../../utils/structs/modelStruct';
import { ModelService } from '../../models/model.service';

@Component({
  selector: 'dms-models-list',
  templateUrl: './models-list.component.html',
  styleUrl: './models-list.component.css'
})
export class ModelsListComponent extends DefaultTableComponent  implements OnInit, OnDestroy {

  //usato per popolare i bottoni e le etichette generiche
    @Input() componentDescription: string;
    @ViewChild(DefaultTableComponent) defaultTableComponent!: DefaultTableComponent;
  
    isLoading =false;
    isError: string = null;
  
    subscription: Subscription;
  
    constructor(private modelService: ModelService, private modalServiceF: NgbModal, private elF: ElementRef )  {
      super(modalServiceF, elF);
    }
  
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
  
    ngOnInit(): void {
      this.loadTableData();
  
    }
  
    loadTableData(){
      this.columns = [
        { header: 'Id', field: 'id', type: '' },
        { header: 'Description', field: 'description', type: '' },
        { header: 'Direction', field: 'direction', type: '' },
        { header: 'Type', field: 'type', type: '' },
        { header: 'Enabled', field: 'enabled', type: 'enabled' }
      ];
      if (this.subscription) this.subscription.unsubscribe();
      this.subscription = this.modelService.modelChanged.subscribe(
        (models: ModelStruct[]) => {
          this.items = models;
          //console.log('Dati passati agli item della tabella :', this.items );
          this.applyFilter();
        }
      );
  
      this.modelService.getModels().pipe(tap({
          next: resData => {
            console.log('Dati ricevuti:', resData);
            this.isLoading=false;
            this.isError=null;
            models => {this.items = models}
        },
  
          error: err => {
            console.log('Errore: ', err);
            this.isError = 'Error on service!  '
            this.isLoading= false;
          }
        })
      )
      .subscribe();
    }
  
  
    onSelectItem(event : {item: any, mode: string}): void {
      this.modelService.startedEditing.next(event);
    }
  
    onManageItem(event : {item: any, mode: string}): void {
      this.modelService.manageItem.next(event);
    }
  
  
    refreshTable(): void {
      this.applyFilter();
    }
  
    onCloseModal(){
      this.defaultTableComponent.closeModal();
    }
  
    clearErr(){
      this.isError=null;
      this.isLoading=false;
    }

}
