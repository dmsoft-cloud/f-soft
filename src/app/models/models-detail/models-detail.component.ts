import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { ModelStruct } from '../../utils/structs/modelStruct';
import { NgForm } from '@angular/forms';
import { GenericDetailComponent } from '../../utils/generic-detail/generic-detail.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { ModelService } from '../model.service';

@Component({
    selector: 'dms-models-detail',
    templateUrl: './models-detail.component.html',
    styleUrl: './models-detail.component.css',
    standalone: false
})
export class ModelsDetailComponent extends GenericDetailComponent implements OnInit, OnDestroy {

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

  constructor( modalServiceF: NgbModal, elF: ElementRef, private  http: HttpClient, private modelService: ModelService,
                private router: Router, private route: ActivatedRoute){

    super(modalServiceF, elF);
  }
  
  ngOnInit(): void {
    this.subscription = this.modelService.startedEditing.subscribe(
      (event: {item: any, mode: string}) => {
          var selectedItem = event.item as ModelStruct;

          // Imposta l'ID nella variabile q_id
          this.q_id = selectedItem.id;
          this.setAuditlog(selectedItem);
          this.quickEditForm.setValue({
                    id: selectedItem.id,
                    description: selectedItem.description,
                    note: selectedItem.note,
                    enabled: selectedItem.enabled,
                    type: selectedItem.type,
                    direction: selectedItem.direction,
                    decompression: selectedItem.decompression,
                    compression: selectedItem.compression,
                    sendMail: selectedItem.sendMail,
                    retry: selectedItem.retry,
                    retryInterval: selectedItem.retryInterval,
                    retention: selectedItem.retention,
                    internationalization: selectedItem.internationalization,
                    deleteFile: selectedItem.deleteFile,
                    uniqueHash: selectedItem.uniqueHash,
                    fetchSize: selectedItem.fetchSize,
                    database: selectedItem.database,
                    schema: selectedItem.schema,
                    sourceCharset: selectedItem.sourceCharset,
                    destCharset: selectedItem.destCharset,
                    fileFormat: selectedItem.fileFormat,
                    header: selectedItem.header,
                    recordDelimiter: selectedItem.recordDelimiter,
                    fieldDelimiter: selectedItem.fieldDelimiter,
                    stringDelimiter: selectedItem.stringDelimiter,
                    removingSpaces: selectedItem.removingSpaces,
                    numericFilling: selectedItem.numericFilling,
                    integrityCheck: selectedItem.integrityCheck,
                    createFile: selectedItem.createFile
          })
      } 
    );
    
    this.modelService.clearAfetrDeleteObservable$.subscribe(
      () =>  {
        this.resetForm();
      }
    );

    this.modelService.resetAfetrUpdateObservable$.subscribe(
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
  
  updateForm(item : ModelStruct) {
    // Update dei campi del form
    this.quickEditForm.setValue({
      id: item.id,
      description: item.description,
      note: item.note,
      enabled: item.enabled,
      type: item.type,
      direction: item.direction,
      decompression: item.decompression,
      compression: item.compression,
      sendMail: item.sendMail,
      retry: item.retry,
      retryInterval: item.retryInterval,
      retention: item.retention,
      internationalization: item.internationalization,
      deleteFile: item.deleteFile,
      uniqueHash: item.uniqueHash,
      fetchSize: item.fetchSize,
      database: item.database,
      schema: item.schema,
      sourceCharset: item.sourceCharset,
      destCharset: item.destCharset,
      fileFormat: item.fileFormat,
      header: item.header,
      recordDelimiter: item.recordDelimiter,
      fieldDelimiter: item.fieldDelimiter,
      stringDelimiter: item.stringDelimiter,
      removingSpaces: item.removingSpaces,
      numericFilling: item.numericFilling,
      integrityCheck: item.integrityCheck,
      createFile: item.createFile
    })
  }

  onCreatePost(formValue : any){

    const newModel = new ModelStruct({
      id: this.q_id,
      description: formValue.description,
      note: formValue.note,
      enabled: formValue.enabled,
      type: formValue.type,
      direction: formValue.direction,
      decompression: formValue.decompression,
      compression: formValue.compression,
      sendMail: formValue.sendMail,
      retry: formValue.retry,
      retryInterval: formValue.retryInterval,
      retention: formValue.retention,
      internationalization: formValue.internationalization,
      deleteFile: formValue.deleteFile,
      uniqueHash: formValue.uniqueHash,
      fetchSize: formValue.fetchSize,
      database: formValue.database,
      schema: formValue.schema,
      sourceCharset: formValue.sourceCharset,
      destCharset: formValue.destCharset,
      fileFormat: formValue.fileFormat,
      header: formValue.header,
      recordDelimiter: formValue.recordDelimiter,
      fieldDelimiter: formValue.fieldDelimiter,
      stringDelimiter: formValue.stringDelimiter,
      removingSpaces: formValue.removingSpaces,
      numericFilling: formValue.numericFilling,
      integrityCheck: formValue.integrityCheck,
      createFile: formValue.createFile
    });

    this.modelService.updateItem(newModel);  //da sostituire con la chiamata al servizio da invocare
    this.genericDetailComponent.closeModal();

    this.toggleQuickEdit(false);
    //this.genericDetailComponent.toggleQuickEdit(false); 

  }
  
  onManageItem(event : {item: any, mode: string}): void {
    this.modelService.manageItem.next(event);
  }



}
