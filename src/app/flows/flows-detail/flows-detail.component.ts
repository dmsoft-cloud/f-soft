import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { FlowStruct } from '../../utils/structs/flowStruct';
import { NgForm } from '@angular/forms';
import { GenericDetailComponent } from '../../utils/generic-detail/generic-detail.component';
import { FlowService } from '../flow.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectOption } from '../../utils/select-custom/select-option.model';

@Component({
  selector: 'dms-flows-detail',
  templateUrl: './flows-detail.component.html',
  styleUrl: './flows-detail.component.css'
})
export class FlowsDetailComponent extends GenericDetailComponent implements OnInit, OnDestroy {
  //componenti specifiche di flows
  model: string="";
  models: SelectOption[] = [];
  origin: string="";
  origins: SelectOption[] = [];


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
  q_id: string = "";

  constructor( modalServiceF: NgbModal, elF: ElementRef, private  http: HttpClient, private flowService: FlowService,
                private router: Router, private route: ActivatedRoute){

    super(modalServiceF, elF);
    //console.log('buttonDescription in InterfacesDetailComponent:', this.buttonDescriptionD); // Log per debug
  }
  
  ngOnInit(): void {
    this.subscription = this.flowService.startedEditing.subscribe(
      (event: {item: any, mode: string}) => {
          var selectedItem = event.item as FlowStruct;

          // Imposta l'ID nella variabile q_id
          this.q_id = selectedItem.id;
          this.quickEditForm.setValue({
            id: selectedItem.id,
            description: selectedItem.description,
            groupId: selectedItem.groupId,
            note: selectedItem.note,
            enabled: selectedItem.enabled,
            model: selectedItem.model,
            origin: selectedItem.origin,
            interfaceId: selectedItem.interfaceId,
            notificationFlow: selectedItem.notificationFlow,
            notificationOk: selectedItem.notificationOk,
            notificationKo: selectedItem.notificationKo,
            integrityFileName: selectedItem.integrityFileName,
            dbTable: selectedItem.dbTable,
            folder: selectedItem.folder,
            file: selectedItem.file,
            remoteFolder: selectedItem.remoteFolder,
            remoteFile: selectedItem.remoteFile,
            lengthFixed: selectedItem.lengthFixed
          })
      } 
    );

    this.flowService.clearAfetrDeleteObservable$.subscribe(
      () =>  {
        this.resetForm();
      }
    );

    this.flowService.resetAfetrUpdateObservable$.subscribe(
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
  
  updateForm(item : FlowStruct) {
    // Update dei campi del form
    this.quickEditForm.setValue({
      id: item.id,
      description: item.description,
      groupId: item.groupId,
      note: item.note,
      enabled: item.enabled,
      model: item.model,
      origin: item.origin,
      interfaceId: item.interfaceId,
      notificationFlow: item.notificationFlow,
      notificationOk: item.notificationOk,
      notificationKo: item.notificationKo,
      integrityFileName: item.integrityFileName,
      dbTable: item.dbTable,
      folder: item.folder,
      file: item.file,
      remoteFolder: item.remoteFolder,
      remoteFile: item.remoteFile,
      lengthFixed: item.lengthFixed
    })
  }

  onCreatePost(formValue : any){

    const newFlow = new FlowStruct(
      this.q_id,
      formValue.description,
      formValue.groupId,
      formValue.note,
      formValue.enabled,
      formValue.model,
      formValue.origin,
      formValue.interfaceId,
      formValue.notificationFlow,
      formValue.notificationOk,
      formValue.notificationKo,
      formValue.integrityFileName,
      formValue.dbTable,
      formValue.folder,
      formValue.file,
      formValue.remoteFolder,
      formValue.remoteFile,
      formValue.lengthFixed
    );

    this.flowService.updateItem(newFlow);  //da sostituire con la chiamata al servizio da invocare
    this.genericDetailComponent.closeModal();
    /*modal.close();
    this.insertForm.reset();
    */
  }
  
  onManageItem(event : {item: any, mode: string}): void {
    this.flowService.manageItem.next(event);
  }

}
