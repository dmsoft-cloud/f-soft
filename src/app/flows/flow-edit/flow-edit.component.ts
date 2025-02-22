import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { filter, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';


import { NavigationEnd, Router } from '@angular/router';
import { GenericEditComponent } from '../../utils/generic-edit/generic-edit.component';

import { enumToSelectOptions, SelectOption } from '../../utils/select-custom/select-option.model';

import { DirectionEnum, FileFormatEnum, LocaleEnum, TypeEnum } from '../../utils/baseEntity';
import { FlowService } from '../flow.service';
import { FlowStruct } from '../../utils/structs/flowStruct';

@Component({
  selector: 'dms-flow-edit',
  templateUrl: './flow-edit.component.html',
  styleUrl: './flow-edit.component.css'
})
export class FlowEditComponent extends GenericEditComponent implements OnInit, OnDestroy {

  @Output() closeModal = new EventEmitter();
  @Input() componentDescription: string = "";
  @ViewChild('manageForm', { static: false }) manageForm: NgForm;

  activeTab: string = 'basicData';  //serve per vedere quale tab è attivo tra quelli presenti

  //componenti specifiche di flows
  model: string="";
  models: SelectOption[] = [];
  origin: string="";
  origins: SelectOption[] = [];
  interfaceId: string="";
  interfaces: SelectOption[] = [];

  editMode : string = "";
  idItem : string = "";
  subscriptionManage: Subscription; 
  private navigationSubscription: Subscription;  //per la navigazione e forzare la init


  constructor( private flowService: FlowService, private router: Router, private cd: ChangeDetectorRef, private fb: FormBuilder) {super()}

  get isEditEnabled(): boolean {
    return (this.editMode === 'E' || this.editMode === 'C' || this.editMode === 'I');
  }

  ngOnInit(): void {

    this.setupNavigationListener();
    //inizilaizzazione campi dropdown

    // Logica di inizializzazione del componente figlio
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
    
    console.log(formValue);
    switch (mode) {
      case 'I':
        this.addItem(formValue);
        break;
      case 'D':
        this.deleteItem(formValue);
        this.flowService.emitClearAfetrDelete();
        break;
      case 'C':
        this.addItem(formValue);
        break;
      case 'E':
        this.updateItem(formValue);
        this.flowService.emitResetAfetrUpdate(formValue);
        break;
      default:
        break;
    }
    this.closeModal.emit();
    //this.genericDetailComponent.closeModal();
    /*modal.close();
    */
  }

/****************************************
* Metodi generici di preparazione item
* 
******************************************/

 setItem(formValue : any) : FlowStruct {
    return  new FlowStruct(
      formValue.id,
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
  }

  addItem(formValue : any){
    this.flowService.addItem(this.setItem(formValue));
  }

  deleteItem(formValue : any){
    this.flowService.deleteItem(this.setItem(formValue));
  }

  updateItem(formValue : any){
    this.flowService.updateItem(this.setItem(formValue));
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
    
    this.subscriptionManage = this.flowService.manageItem.subscribe(
      (event: {item: any, mode: string}) => {
          var selectedItem = event.item as FlowStruct;
          this.editMode=event.mode;
          //console.log('modalità: ' + event.mode)
          
          setTimeout(() => {

                if (event.mode != "" && event.mode !="I" ) {
                  this.idItem = selectedItem.id;
                  this.manageForm.setValue({                   
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
                if (event.mode ==="I"){
                  this.manageForm.reset();
                  this.manageForm.setValue({

                    id: "",
                    description: "",
                    groupId: "",
                    note: "",
                    enabled: "S",
                    model: "",
                    origin: "",
                    interfaceId: "",
                    notificationFlow: "",
                    notificationOk: "",
                    notificationKo: "",
                    integrityFileName: "",
                    dbTable: "",
                    folder: "",
                    file: "",
                    remoteFolder: "",
                    remoteFile: "",
                    lengthFixed: 0
                  })
                }
          }, );

      } 

    );

  }

}
