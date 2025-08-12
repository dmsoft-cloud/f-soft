import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { filter, map, Observable, Subscription } from 'rxjs';
import { AbstractControl, FormBuilder, FormGroup, NgForm, ValidatorFn, Validators } from '@angular/forms';


import { NavigationEnd, Router } from '@angular/router';

import { enumToSelectOptions, SelectOption } from '../../utils/select-custom/select-option.model';

import { DirectionEnum, FileFormatEnum, LocaleEnum, TypeEnum } from '../../utils/baseEntity';
import { FlowService } from '../flow.service';
import { FlowStruct } from '../../utils/structs/flowStruct';
import { GroupService } from '../../groups/group.service';
import { ModelService } from '../../models/model.service';
import { OriginService } from '../../origins/origin.service';
import { InterfaceService } from '../../interfaces/interface.service';
import { EmailService } from '../../emails/email.service';
import { BaseEditComponent } from '../../utils/base-edit/base-edit.component';
import { ModelStruct } from '../../utils/structs/modelStruct';
import { OriginStruct } from '../../utils/structs/originStruct';
import { InterfaceStruct } from '../../utils/structs/interfaceStruct';

@Component({
    selector: 'dms-flow-edit',
    templateUrl: './flow-edit.component.html',
    styleUrl: './flow-edit.component.css',
    standalone: false
})
export class FlowEditComponent extends BaseEditComponent implements OnInit, OnDestroy {

  @Input() record: FlowStruct | null = null; 
  @Output() invalidFields = new EventEmitter<string[]>();
  manualErrors: string[] = [];

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
  notificationFlow:string="";
  notificationOk:string="";
  notificationKo:string="";
  communicationOptions$: Observable<SelectOption[]>;

  /**********************************
  *   elmenti selezionati
  ***********************************/
  selectedModel: ModelStruct;
  selectedOrigin: OriginStruct;
  selectedInterface: InterfaceStruct;


  constructor( protected flowService: FlowService, protected router: Router, protected cd: ChangeDetectorRef, 
    protected fb: FormBuilder, protected groupService: GroupService, protected modelService: ModelService, 
    protected originService: OriginService, protected interfaceService: InterfaceService, protected emailService: EmailService ) {super(fb)}

    get isEditEnabled(): boolean {
      return (this.editMode === 'E' || this.editMode === 'C' || this.editMode === 'I');
    }

    ngOnInit(): void {
      super.ngOnInit();

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

      if (formValue.invalid) {
      // forza la visualizzazione degli errori su tutti i campi
      formValue.control.markAllAsTouched();
      return;
      }
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

    submitItem(mode: string){
          this.manualErrors.length = 0;
          const id = this.form.get('id')?.value;
    
          if (mode === 'I' || mode === 'C' ) {
            this.flowService.getFlow(id).subscribe({
              next: (existingItem) => {
                if (existingItem) {
                  this.manualErrors.push('ID already exists !');
                  this.form.markAllAsTouched();
                  return;
                } else {
                  this.submit(mode);
                }
              },
              error: (err) => {
                  this.manualErrors.push('Error checking item: ' + err.message);   
                  this.form.markAllAsTouched();         
              }
            });
          } else {
            this.submit(mode);
          }
      }
    
    
      /** Al submit valido emetto chiamata al service */
      submit(mode: string) {
        super.submit(mode);
        if (!this.form.invalid) {
          const m = new FlowStruct(this.form.value);
          switch (mode) {
            case 'I': this.flowService.addItem(m); break;
            case 'C': this.flowService.addItem(m); break;
            case 'E': 
              this.flowService.updateItem(m); 
              this.flowService.emitResetAfetrUpdate(m);
              break;
            case 'D':
              this.flowService.deleteItem(m);
              this.flowService.emitClearAfetrDelete();
              break;
          }
          this.closeModal.emit();
        }
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

submitForm() {
    if (this.editMode === 'E' || this.editMode === 'D') {
      this.form.value.id = this.idItem;  // Assegna il valore manualmente
    }

    this.submitItem(this.editMode);
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
                  this.form.patchValue({                  
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
                  this.form.reset({

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
                  });
                  this.selectedModel=null;
                  this.selectedOrigin=null;
                  this.selectedInterface=null;
                }

                if (!this.isEditEnabled) {
                  this.form.disable({ emitEvent: false });
                } else {
                this.form.enable({ emitEvent: false });
                }
                if (event.mode ==="E"){
                  this.form.get('id').disable({ emitEvent: false });
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

    //inizializza selezione communications
    this.communicationOptions$ = this.emailService.getEmails().pipe(
      map(emails => emails.map(emailId => ({
        code: emailId.id, // Usa l'ID come valore
        description: emailId.subject // Usa oggetto
      })))
    );

  }

  /*********************************************/
  /*       metodi di cambio selezione elementi */
  /*********************************************/ 
  onModelChange(newItem: string) {
     if (newItem !== ""){
      this.modelService.getModel(newItem).subscribe({
                next: (existingItem) => {
                  if (existingItem) {
                    this.selectedModel = existingItem;
                    this.manualErrors = this.manualErrors.filter(err => err !== 'Table is mandatory');

                    if (this.selectedModel?.type !== 'D') {
                        this.form.patchValue({ dbTable: ''}, { emitEvent: false });
                    }
                    if (this.selectedModel?.type === 'D' && this.form.get('dbTable').value === '' ){this.manualErrors.push('Table is mandatory');}
                    

                    return;
                  } else {
                    this.manualErrors.push('Model not found !!');
                  }
                },
                error: (err) => {
                    this.manualErrors.push('Model not found !! : ' + err.message);   
                    this.form.markAllAsTouched();         
                }
              });
      }

  }

  onOriginChange(newItem: string) {
    if (newItem !== ""){
      this.originService.getOrigin(newItem).subscribe({
                next: (existingItem) => {
                  if (existingItem) {
                    this.selectedOrigin = existingItem;
                    return;
                  } else {
                    this.manualErrors.push('Origin not found !!');
                  }
                },
                error: (err) => {
                    this.manualErrors.push('Origin not found !! : ' + err.message);   
                    this.form.markAllAsTouched();         
                }
              });
    }
  }

  onInterfaceChange(newItem: string) {
    if (newItem !== ""){
      this.interfaceService.getInterface(newItem).subscribe({
                next: (existingItem) => {
                  if (existingItem) {
                    this.selectedInterface = existingItem;
                    return;
                  } else {
                    this.manualErrors.push('Interface not found !!');
                  }
                },
                error: (err) => {
                    this.manualErrors.push('Interface not found !! : ' + err.message);   
                    this.form.markAllAsTouched();         
                }
              });
    }
  }

  /*********************************************/
  /*       metodi di controllo del form        */
  /*********************************************/ 
  protected getControlsConfig() {
    return {
      id: ['', [Validators.required, Validators.maxLength(20)]],
      description:[''],
      groupId: [''],
      note:[''],
      enabled:    ['S'],
      model: ['', Validators.required],
      origin: [''],
      interfaceId: ['', Validators.required],
      notificationFlow: [''],
      notificationOk: [''],
      notificationKo: [''],
      integrityFileName: [''],
      dbTable: [''],
      folder: ['',Validators.required],
      file: ['', Validators.required],
      remoteFolder: [''],
      remoteFile: [''],
      lengthFixed: [0]
      
    };
  }
  


   /** Validator di form group per i campi specifici */
  protected getCrossFieldValidator(): ValidatorFn {
    return (group: AbstractControl) => {
      const errs: any = {};
      //se siamo nel caso db devo richiedere la tabella
      
      if (this.selectedModel?.type === 'D') {
        if (!group.get('dbTable')?.value) errs.dbTableRequired = true;
      }
      //se siamo nel caso di spedizione via mail devo richiedere il codice mail da trasmettere
      
      if (this.selectedInterface?.connectionType === 'M') {
        if (!group.get('notificationFlow')?.value) errs.notificationFlowRequired = true;
      }
            
      if (this.selectedModel?.sendMail === 'S') {
        if (!group.get('notificationOk')?.value) errs.notificationOkRequired = true;
        if (!group.get('notificationKo')?.value) errs.notificationKoRequired = true;
      }

      if (this.selectedModel?.type === 'D') {
        if (!group.get('origin')?.value) errs.originRequired = true;
      }
      

      
      return Object.keys(errs).length ? errs : null;
    };
  }

 /** Riepilogo errori per summary + emissione */
  get errorSummary(): string[] {
    const errs: string[] = [...this.manualErrors];
    
    if (!(this.submitted || Object.values(this.form.controls).some(c=>c.touched))) {
      return errs;
    }
    
    const c = this.form.controls;
    if (c.model.errors?.required)      errs.push('Model is mandatory');
    if (c.interfaceId.errors?.required)      errs.push('Interface is mandatory');
    if (c.folder.errors?.required)      errs.push('Folder is mandatory');
    if (c.file.errors?.required)      errs.push('File is mandatory');

    const gf = this.form.errors;
    if (gf?.notificationFlowRequired) errs.push('Notification Flow is mandatory');
    if (gf?.notificationOkRequired) errs.push('Notification Ok is mandatory');
    if (gf?.notificationKoRequired) errs.push('Notification Ko is mandatory');
    if (gf?.originRequired) errs.push('Origin is mandatory');


    

    return errs;
  }


   /** Quando cambia un valore, azzero/disabilito i campi correlati */
  protected onFormChanges() {
    const g = this.form;
    const currentValues = g.value;

    if (this.previousFormValues.dbTable !== currentValues.dbTable) {
    // 👉 Il campo 'model' è cambiato
      this.onModelChange(currentValues.model);
    
    }

   
  }



}
