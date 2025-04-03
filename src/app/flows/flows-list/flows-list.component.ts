import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DefaultTableComponent } from '../../utils/default-table/default-table.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, tap } from 'rxjs';
import { FlowStruct } from '../../utils/structs/flowStruct';
import { FlowService } from '../flow.service';

@Component({
    selector: 'dms-flows-list',
    templateUrl: './flows-list.component.html',
    styleUrl: './flows-list.component.css',
    standalone: false
})
export class FlowsListComponent extends DefaultTableComponent  implements OnInit, OnDestroy {

 //usato per popolare i bottoni e le etichette generiche
 @Input() componentDescription: string;
 @ViewChild(DefaultTableComponent) defaultTableComponent!: DefaultTableComponent;

 isLoading =false;
 isError: string = null;

 subscription: Subscription;

 constructor(private flowService: FlowService, private modalServiceF: NgbModal, private elF: ElementRef )  {
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
     { header: 'Group', field: 'groupId', type: '' },
     { header: 'table', field: 'dbTable', type: '' },
     { header: 'FileName', field: 'file', type: '' },
     { header: 'Enabled', field: 'enabled',  type: 'enabled' },
   ];
   this.subscription = this.flowService.flowChanged.subscribe(
     (flows: FlowStruct[]) => {
       this.items = flows;
       this.applyFilter();
     }
   );

   //this.items = this.flowService.getFlows();
   this.flowService.getFlows().pipe(tap({
       next: resData => {
         console.log('Dati ricevuti:', resData);
         this.isLoading=false;
         this.isError=null;
         flows => {this.items = flows}
     },

       error: err => {
         console.log('Errore: ', err);
         this.isError = 'Error on service!  '
         this.isLoading= false;
       }
     })
   )
   //.subscribe(flows => {this.items = flows});
   .subscribe();
 }


 onSelectItem(event : {item: any, mode: string}): void {
   this.flowService.startedEditing.next(event);
 }

 onManageItem(event : {item: any, mode: string}): void {
   this.flowService.manageItem.next(event);
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
