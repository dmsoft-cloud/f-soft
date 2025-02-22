import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { InterfaceStruct } from '../../utils/structs/interfaceStruct';
import { NgForm } from '@angular/forms';
import { GenericDetailComponent } from '../../utils/generic-detail/generic-detail.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InterfaceService } from '../interface.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'dms-interfaces-detail',
  templateUrl: './interfaces-detail.component.html',
  styleUrl: './interfaces-detail.component.css'
})
export class InterfacesDetailComponent extends GenericDetailComponent implements OnInit, OnDestroy {
  subscription: Subscription; 
  subscriptionManage: Subscription; 

  @ViewChild('quickEditForm', { static: false }) quickEditForm: NgForm;
  @ViewChild('insertForm', { static: false }) insertForm: NgForm;

  @ViewChild(GenericDetailComponent) genericDetailComponent!: GenericDetailComponent;

  quickModeAcive: boolean; //serve a indicare se è attiva la modalità di modifica quick mode

  //usato per popolare i bottoni e le etichette generiche
  @Input() buttonDescriptionD: string = "Default Description";

  // Definisci la variabile per memorizzare l'ID che vuoi inviare nel form
  q_id: string = "";

  constructor( modalServiceF: NgbModal, elF: ElementRef, private  http: HttpClient, private interfaceService: InterfaceService,
                private router: Router, private route: ActivatedRoute){

    super(modalServiceF, elF);
  }
  
  ngOnInit(): void {
    this.subscription = this.interfaceService.startedEditing.subscribe(
      (event: {item: any, mode: string}) => {
          var selectedItem = event.item as InterfaceStruct;
          //console.log("valore item arrivato nel quickForm: " + JSON.stringify(event.item));
          // Imposta l'ID nella variabile q_id
          this.q_id = selectedItem.id;
          this.quickEditForm.setValue({
            id: selectedItem.id,
            description: selectedItem.description,
            connectionType: selectedItem.connectionType,
            passiveMode: selectedItem.passiveMode,
            secureFTP: selectedItem.secureFtp,
            host : selectedItem.host,
            port : selectedItem.port,
            user : selectedItem.user,
            password : selectedItem.password,
            sftpAlias : selectedItem.sftpAlias,
            knownhost : selectedItem.knownHost,
            keyFile : selectedItem.keyFile,
            trustHost : selectedItem.trustHost,
            status: selectedItem.enabled,
            notes: selectedItem.note
          })
      } 
    );

    this.interfaceService.clearAfetrDeleteObservable$.subscribe(
      () =>  {
        this.resetForm();
      }
    );

    this.interfaceService.resetAfetrUpdateObservable$.subscribe(
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
    this.isQuickEditEnabled = event;  
  }

  onCloseModal(){
    this.genericDetailComponent.closeModal();
  }

  resetForm() {
    // Reset dei campi del form
    this.quickEditForm.resetForm();
  }

  updateForm(item : InterfaceStruct) {
    // Update dei campi del form
    this.quickEditForm.setValue({
      id: item.id,
      description: item.description,
      connectionType: item.connectionType,
      passiveMode: item.passiveMode,
      secureFTP: item.secureFtp,
      host : item.host,
      port : item.port,
      user : item.user,
      password : item.password,
      sftpAlias : item.sftpAlias,
      knownhost : item.knownHost,
      keyFile : item.keyFile,
      trustHost : item.trustHost,
      status: item.enabled,
      notes: item.note

    });
  }


  onCreatePost(formValue : any){

    const newInterface = new InterfaceStruct(
      formValue.id,
      formValue.description,
      formValue.connectionType,
      formValue.passiveMode,
      formValue.secureFTP,
      formValue.host,
      formValue.port,
      formValue.user,
      formValue.password,
      formValue.sftpAlias,
      formValue.knownhost,
      formValue.keyFile,
      formValue.trustHost,
      formValue.status,
      formValue.notes
    );

    this.interfaceService.updateItem(newInterface);  //da sostituire con la chiamata al servizio da invocare
    this.genericDetailComponent.closeModal();

    this.toggleQuickEdit(false);
    this.genericDetailComponent.toggleQuickEdit(false); 

  }

  onManageItem(event : {item: any, mode: string}): void {
    this.interfaceService.manageItem.next(event);
  }

  onCancel() {
    this.router.navigate(['../interfaces'], {relativeTo: this.route});
  }

}
