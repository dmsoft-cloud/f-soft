import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { HostService } from '../host.service';
import { DefaultTableComponent } from '../../utils/default-table/default-table.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, tap } from 'rxjs';
import { HostStruct } from '../../utils/structs/hostStruct';

@Component({
  selector: 'dms-hosts-list',
  templateUrl: './hosts-list.component.html',
  styleUrl: './hosts-list.component.css'
})
export class HostsListComponent extends DefaultTableComponent  implements OnInit  {

    //usato per popolare i bottoni e le etichette generiche
    @Input() componentDescription: string;
    @ViewChild(DefaultTableComponent) defaultTableComponent!: DefaultTableComponent;
  
    isLoading =false;
    isError: string = null;
  
    subscription: Subscription;

    constructor(private hostService: HostService, private modalServiceF: NgbModal, private elF: ElementRef )  {
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
        { header: 'ID', field: 'id', type: '' },
        { header: 'Name', field: 'name', type: '' },
        { header: 'Description', field: 'description', type: '' },
        { header: 'Host', field: 'host', type: '' },
        { header: 'Enabled', field: 'status', type: 'enabled' }
      ];
      this.subscription = this.hostService.hostChanged.subscribe(
        (interfaces: HostStruct[]) => {
          this.items = interfaces;
          this.applyFilter();
        }
      );
  
      //this.items = this.hostService.getHosts();
      this.hostService.getHosts().pipe(tap({
          next: resData => {
            console.log('Dati ricevuti:', resData);
            this.isLoading=false;
            this.isError=null;
            hosts => {this.items = hosts}
        },
  
          error: err => {
            console.log('Errore: ', err);
            this.isError = 'Error on service!  '
            this.isLoading= false;
          }
        })
      )
      //.subscribe(hosts => {this.items = hosts});
      .subscribe();
    }
  
  
    onSelectItem(event : {item: any, mode: string}): void {
      this.hostService.startedEditing.next(event);
    }
  
    onManageItem(event : {item: any, mode: string}): void {
      this.hostService.manageItem.next(event);
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


