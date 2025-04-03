import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { filter, map, Observable, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';


import { NavigationEnd, Router } from '@angular/router';
import { GenericEditComponent } from '../../utils/generic-edit/generic-edit.component';

import { enumToSelectOptions, SelectOption } from '../../utils/select-custom/select-option.model';

import { DirectionEnum, FileFormatEnum, LocaleEnum, TypeEnum } from '../../utils/baseEntity';
import { FlowService } from '../flow.service';
import { FlowStruct } from '../../utils/structs/flowStruct';
import { GroupService } from '../../groups/group.service';
import { ModelService } from '../../models/model.service';
import { OriginService } from '../../origins/origin.service';
import { InterfaceService } from '../../interfaces/interface.service';

@Component({
    selector: 'dms-flow-edit',
    templateUrl: './flow-edit.component.html',
    styleUrl: './flow-edit.component.css',
    standalone: false
})
export class FlowEditComponent extends GenericEditComponent implements OnInit, OnDestroy {

  @Output() closeModal = new EventEmitter();
  @Input() componentDescription: string = "";
  @ViewChild('manageForm', { static: false }) manageForm: NgForm;

  activeTab: string = 'basicData';  //serve per vedere quale tab è attivo tra quelli presenti

  editMode : string = "";
  idItem : string = "";
  subscriptionManage: Subscription; 
  private navigationSubscription: Subscription;  //per la navigazione e forzare la init

  /**********************************
  *   elmenti per campi select
  ***********************************/
  groupId: string="";
  groupOptions$: Observable<SelectOption[]>;
  model: string="";
  modelOptions$: Observable<SelectOption[]>;
  origin: string="";
  originOptions$: Observable<SelectOption[]>;
  interfaceId: string="";
  interfaceOptions$: Observable<SelectOption[]>;

  constructor( private flowService: FlowService, private router: Router, private cd: ChangeDetectorRef, 
    private fb: FormBuilder, private groupService: GroupService, private modelService: ModelService, 
    private originService: OriginService, private interfaceService: InterfaceService ) {super()}

    get isEditEnabled(): boolean {
      return (this.editMode === 'E' || this.editMode === 'C' || this.editMode === 'I');
    }

    ngOnInit(): void {

      this.setupNavigationListener();
      this.initializeComponent();
      this.loadSelectFields();

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
      console.log("modalità getione form: " + mode )
      console.log("valore Form:  ");
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
  return  new FlowStruct({
    id: formValue.id,
    description: formValue.description,
    groupId: formValue.groupId,
    note: formValue.note,
    enabled: formValue.enabled,
    model: formValue.model,
    origin: formValue.origin,
    interfaceId: formValue.interfaceId,
    notificationFlow: formValue.notificationFlow,
    notificationOk: formValue.notificationOk,
    notificationKo: formValue.notificationKo,
    integrityFileName: formValue.integrityFileName,
    dbTable: formValue.dbTable,
    folder: formValue.folder,
    file: formValue.file,
    remoteFolder: formValue.remoteFolder,
    remoteFile: formValue.remoteFile,
    lengthFixed: formValue.lengthFixed
  });
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



  loadSelectFields() :void {
    //inizializza combo gruppi
    this.groupOptions$ = this.groupService.getGroups().pipe(
    map(groups => groups.map(group => ({
      code: group.id, // Usa l'ID come valore
      description: group.description // Usa la descrizione come testo visibile
    })))
    );

    //inizializza combo modelli
    this.modelOptions$ = this.modelService.getModels().pipe(
      map(models => models.map(model => ({
        code: model.id, // Usa l'ID come valore
        description: model.description // Usa la descrizione come testo visibile
      })))
    );

    //inizializza combo origini
    this.originOptions$ = this.originService.getOrigins().pipe(
      map(origins => origins.map(origin => ({
        code: origin.id, // Usa l'ID come valore
        description: origin.description // Usa la descrizione come testo visibile
      })))
    );


    //inizializza combo interfacce
    this.interfaceOptions$ = this.interfaceService.getInterfaces().pipe(
      map(interfaces => interfaces.map(interfaceId => ({
        code: interfaceId.id, // Usa l'ID come valore
        description: interfaceId.description // Usa la descrizione come testo visibile
      })))
    );

  }

}
