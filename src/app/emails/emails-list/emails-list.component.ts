import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DefaultTableComponent } from '../../utils/default-table/default-table.component';
import { Subscription, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmailService } from '../email.service';
import { EmailStruct } from '../../utils/structs/emailStruct';

@Component({
  selector: 'dms-emails-list',
  templateUrl: './emails-list.component.html',
  styleUrl: './emails-list.component.css'
})
export class EmailsListComponent extends DefaultTableComponent  implements OnInit, OnDestroy {

//usato per popolare i bottoni e le etichette generiche
 @Input() componentDescription: string;
 @ViewChild(DefaultTableComponent) defaultTableComponent!: DefaultTableComponent;

 isLoading =false;
 isError: string = null;

 subscription: Subscription;

 constructor(private emailService: EmailService, private modalServiceF: NgbModal, private elF: ElementRef )  {
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
     { header: 'Status', field: 'enabled', type: '' },
     { header: 'Subject', field: 'subject', type: '' }
   ];
   this.subscription = this.emailService.emailChanged.subscribe(
     (emails: EmailStruct[]) => {
       this.items = emails;
       this.applyFilter();
     }
   );

   //this.items = this.emailService.getFlows();
   this.emailService.getEmails().pipe(tap({
       next: resData => {
         //console.log('Dati ricevuti:', resData);
         this.isLoading=false;
         this.isError=null;
         emails => {this.items = emails}
     },

       error: err => {
         console.log('Errore: ', err);
         this.isError = 'Error on service!  '
         this.isLoading= false;
       }
     })
   )
   //.subscribe(emails => {this.items = emails});
   .subscribe();
 }

 onSelectItem(event : {item: any, mode: string}): void {
  this.emailService.startedEditing.next(event);
}

onManageItem(event : {item: any, mode: string}): void {
  this.emailService.manageItem.next(event);
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
