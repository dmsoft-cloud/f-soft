import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { InterfaceService } from '../interface.service';
import { DefaultTableComponent } from '../../utils/default-table/default-table.component';
import { Subscription, tap } from 'rxjs';
import { InterfaceStruct } from '../../utils/structs/interfaceStruct';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'dms-interfaces-list',
  templateUrl: './interfaces-list.component.html',
  styleUrl: './interfaces-list.component.css'
})
export class InterfacesListComponent extends DefaultTableComponent  implements OnInit, OnDestroy{
  @Input() componentDescription: string;
  @ViewChild(DefaultTableComponent) defaultTableComponent!: DefaultTableComponent;

  isLoading =false;
  isError: string = null;

  subscription: Subscription;
  
  constructor(private interfaceService: InterfaceService, private modalServiceF: NgbModal, private elF: ElementRef)  {
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
      { header: 'Id', field: 'id', type: ''},
      { header: 'Description', field: 'description', type: '' },
      { header: 'Host', field: 'host', type: '' },
      { header: 'Connection Type', field: 'connectionType', type: '' },
      { header: 'Port', field: 'port', type: '' },
      { header: 'Enabled', field: 'enabled', type: 'enabled' }
    ];
    if (this.subscription) this.subscription.unsubscribe();
    this.subscription = this.interfaceService.interfaceChanged.subscribe(
          (interfaces: InterfaceStruct[]) => {
            this.items = interfaces;
            this.applyFilter();
          }
    );

    this.interfaceService.getInterfaces().pipe(tap({
        next: resData => {
          console.log('Dati ricevuti:', resData);
          this.isLoading=false;
          this.isError=null;
          interfaces => {this.items = interfaces}
      },

        error: err => {
          console.log('Errore: ', err);
          this.isError = 'Error on service!  '
          this.isLoading= false;
        }
      })
    ).subscribe();
  }
  

  onSelectItem(event : {item: any, mode: string}): void {
    //console.log("Selezionato elemento :" + JSON.stringify(event.item));
    this.interfaceService.startedEditing.next(event);
  }

  onManageItem(event : {item: any, mode: string}): void {
    this.interfaceService.manageItem.next(event);
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
