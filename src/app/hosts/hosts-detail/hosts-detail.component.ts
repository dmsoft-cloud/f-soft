import { Component, ElementRef, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { GenericDetailComponent } from '../../utils/generic-detail/generic-detail.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { HostService } from '../host.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { HostStruct } from '../../utils/structs/hostStruct';

@Component({
  selector: 'dms-hosts-detail',
  templateUrl: './hosts-detail.component.html',
  styleUrl: './hosts-detail.component.css'
})
export class HostsDetailComponent extends GenericDetailComponent implements OnInit, OnDestroy {

  subscription: Subscription; 
  subscriptionManage: Subscription; 
  

  @ViewChild('quickEditForm', { static: false }) quickEditForm: NgForm;
  @ViewChild('insertForm', { static: false }) insertForm: NgForm;
  
  @ViewChild(GenericDetailComponent) genericDetailComponent!: GenericDetailComponent;
  

  quickModeAcive: boolean; //serve a indicare se è attiva la modalità di modifica quick mode

  connectionType: string=""; //tipo di connessione per l'elemento

  //usato per popolare i bottoni e le etichette generiche
  @Input() buttonDescriptionD: string = "Default Description";

  // Definisci la variabile per memorizzare l'ID che vuoi inviare nel form
  q_id: number = 0;

  constructor( modalServiceF: NgbModal, elF: ElementRef, private  http: HttpClient, private hostService: HostService,
                private router: Router, private route: ActivatedRoute){

    super(modalServiceF, elF);
    //console.log('buttonDescription in InterfacesDetailComponent:', this.buttonDescriptionD); // Log per debug
  }
  
  ngOnInit(): void {
    this.subscription = this.hostService.startedEditing.subscribe(
      (event: {item: any, mode: string}) => {
          var selectedItem = event.item as HostStruct;

          // Imposta l'ID nella variabile q_id
          this.q_id = selectedItem.id;
          this.quickEditForm.setValue({
            id: selectedItem.id,
            name: selectedItem.name,
            description: selectedItem.description,
            host: selectedItem.host,
            remote: selectedItem.remote,
            type: selectedItem.type,
            notes: selectedItem.notes,
            status: selectedItem.status
          })
      } 
    );

    this.hostService.clearAfetrDeleteObservable$.subscribe(
      () =>  {
        this.resetForm();
      }
    );

    this.hostService.resetAfetrUpdateObservable$.subscribe(
      item =>  {
        this.updateForm(item);
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }



  toggleQuickEdit(event: boolean){
     this.quickModeAcive = event;  
  }
  
  onCloseModal(){
    this.genericDetailComponent.closeModal();
  }

  resetForm() {
    // Reset dei campi del form
    this.quickEditForm.resetForm();
  }
  
  updateForm(item : HostStruct) {
    // Update dei campi del form
    this.quickEditForm.setValue({
      id: item.id,
      name: item.name,
      description: item.description,
      host: item.host,
      notes: item.notes,
      status: item.status
    })
  }

  onCreatePost(formValue : any){

    const newHost = new HostStruct(
      this.q_id,
      formValue.name,
      formValue.description,
      formValue.host,
      formValue.remote,
      formValue.type,
      formValue.status,
      formValue.notes
    );

    this.hostService.updateItem(newHost);  //da sostituire con la chiamata al servizio da invocare
    this.genericDetailComponent.closeModal();
    /*modal.close();
    this.insertForm.reset();
    */
  }
  
  onManageItem(event : {item: any, mode: string}): void {
    this.hostService.manageItem.next(event);
  }



}
