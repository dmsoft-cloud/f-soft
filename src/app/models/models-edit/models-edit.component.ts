import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { filter, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';

import { ModelStruct } from '../../utils/structs/modelStruct';
import { NavigationEnd, Router } from '@angular/router';
import { GenericEditComponent } from '../../utils/generic-edit/generic-edit.component';
import { ModelService } from '../../models/model.service';
import { enumToSelectOptions, SelectOption } from '../../utils/select-custom/select-option.model';

import { DirectionEnum, FileFormatEnum, LocaleEnum, TypeEnum } from '../../utils/baseEntity';


@Component({
    selector: 'dms-models-edit',
    templateUrl: './models-edit.component.html',
    styleUrl: './models-edit.component.css',
    standalone: false
})
export class ModelsEditComponent extends GenericEditComponent implements OnInit, OnDestroy  {

 @Output() closeModal = new EventEmitter();
  @Input() componentDescription: string = "";
  @ViewChild('manageForm', { static: false }) manageForm: NgForm;

  activeTab: string = 'basicData';  //serve per vedere quale tab è attivo tra quelli presenti

  

  //capi per select fields
  type: string=""; //tipo di esportazione/importazione
  types: SelectOption[] = []; // Opzioni della select
  direction: string="";
  directions: SelectOption[] = [];
  locale: string="";
  localeList: SelectOption[] = [];
  fileFormat: string="";
  fileFormats: SelectOption[] = [];

  editMode : string = "";
  idItem : string = "";
  subscriptionManage: Subscription; 
  private navigationSubscription: Subscription;  //per la navigazione e forzare la init

    // Form principale con form annidati
    //manageForm: FormGroup;


  constructor( private modelService: ModelService, private router: Router, private cd: ChangeDetectorRef, private fb: FormBuilder) {super()}

  get isEditEnabled(): boolean {
    return (this.editMode === 'E' || this.editMode === 'C' || this.editMode === 'I');
  }

  ngOnInit(): void {

    this.setupNavigationListener();
    // Logica di inizializzazione del componente figlio
    this.types = enumToSelectOptions(TypeEnum);
    this.directions = enumToSelectOptions(DirectionEnum);
    this.localeList = enumToSelectOptions(LocaleEnum);
    this.fileFormats = enumToSelectOptions(FileFormatEnum);
    this.initializeComponent();


  }

  ngOnDestroy(): void {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
    if (this.subscriptionManage){
      this.subscriptionManage.unsubscribe();
    }
  }

  private setupNavigationListener(): void {
    this.navigationSubscription = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        this.onNavigationEnd();
      });
  }

  onManageRequest(formValue : any, mode :  string){    
    //console.log("valore Form:  ");
    //console.log(formValue);
    switch (mode) {
      case 'I':
        this.addItem(formValue);
        break;
      case 'D':
        this.deleteItem(formValue);
        this.modelService.emitClearAfetrDelete();
        break;
      case 'C':
        this.addItem(formValue);
        break;
      case 'E':
        this.updateItem(formValue);
        this.modelService.emitResetAfetrUpdate(formValue);
        break;
      default:
        break;
    }
    this.closeModal.emit();
  }

/****************************************
* Metodi generici di preparazione item
* 
******************************************/
  setItem(formValue : any) : ModelStruct {
    return  new ModelStruct({
      id: formValue.id,
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
  }

  addItem(formValue : any){
    this.modelService.addItem(this.setItem(formValue));
  }

  deleteItem(formValue : any){
    this.modelService.deleteItem(this.setItem(formValue));
  }

  updateItem(formValue : any){
    this.modelService.updateItem(this.setItem(formValue));
  }

  submitForm(form: NgForm) {
    if (this.editMode === 'E') {
      form.value.id = this.idItem;  // Assegna il valore manualmente
    }

    if (form) {
      form.ngSubmit.emit();
    }
  }

/****************************************
* Metodi gestione componente
* 
******************************************/
  private onNavigationEnd(): void {
    // Logica che vuoi eseguire ogni volta che c'è una navigazione
    this.initializeComponent();
  }

  private initializeComponent(): void {
    
    this.subscriptionManage = this.modelService.manageItem.subscribe(
      (event: {item: any, mode: string}) => {
          var selectedItem = event.item as ModelStruct;
          this.editMode=event.mode;
          //console.log('modalità: ' + event.mode)
          
          setTimeout(() => {

                if (event.mode != "" && event.mode !="I" ) {
                  this.idItem = selectedItem.id;
                  this.manageForm.setValue({
                    
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
                    
                  });
                  
                }
                if (event.mode ==="I"){
                  this.manageForm.reset(); //fa la pulizia della form
                  this.manageForm.setValue({
                    
                    id: '',
                    description: '',
                    note: '',
                    enabled: 'S',
                    type: '',
                    direction: '',
                    decompression: 'N',
                    compression: 'N',
                    sendMail: 'N',
                    retry: 0,
                    retryInterval: 0,
                    retention: 0,
                    internationalization: '',
                    deleteFile: 'N',
                    uniqueHash: 'N',
                    fetchSize: 0,
                    database: '',
                    schema: '',
                    sourceCharset: '',
                    destCharset: '',
                    fileFormat: '',
                    header: 'N',
                    recordDelimiter: '',
                    fieldDelimiter: '',
                    stringDelimiter: '',
                    removingSpaces: '',
                    numericFilling: '',
                    integrityCheck: 'N',
                    createFile: 'N'
                  });
                  this.activeTab = 'basicData';
                }
              }, );
              
      } 

    );

  }


  /*********************************************/
  /*       metodi di gestione tab              */
  /*********************************************/ 
  /*
  onTabChange(tabName: string) {
    setTimeout(() => {
      const tabElement = document.querySelector(`#${tabName}-tab`) as HTMLElement;
      if (tabElement) {
        tabElement.click(); // Simula il click sul tab corrispondente
      }
      this.cd.detectChanges(); // Forza il rilevamento delle modifiche
    }, 0);
  }
 */


  

}
