import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, NgForm, ValidatorFn, Validators } from '@angular/forms';
import { filter, Subscription } from 'rxjs';
import { InterfaceService } from '../interface.service';
import { InterfaceStruct } from '../../utils/structs/interfaceStruct';
import { NavigationEnd, Router } from '@angular/router';
import { GenericEditComponent } from '../../utils/generic-edit/generic-edit.component';
import { isTemplateExpression } from 'typescript';
import { enumToSelectOptions, SelectOption } from '../../utils/select-custom/select-option.model';
import { ConnectionTypeEnum } from '../../utils/baseEntity';
import { BaseEditComponent } from '../../utils/base-edit/base-edit.component';


@Component({
    selector: 'dms-interface-edit',
    templateUrl: './interface-edit.component.html',
    styleUrl: './interface-edit.component.scss',
    standalone: false
})
export class InterfaceEditComponent extends BaseEditComponent implements OnInit {

  @Input() record: InterfaceStruct | null = null; 
  @Output() invalidFields = new EventEmitter<string[]>();
  manualErrors: string[] = [];

  @Output() closeModal = new EventEmitter();
  @Input() componentDescription: string = "";
  @ViewChild('manageForm', { static: false }) manageForm: NgForm;

  activeTab: string = 'basicData';  //serve per vedere quale tab è attivo tra quelli presenti

  //campi del select custom
  connType: string=""; //tipo di connessione inizializzazione valore
  connectionTypes: SelectOption[] = []; // Opzioni della select

  secureFtp: string = 'N'; // inizializzazione valore

  editMode : string = "";
  idItem : string = "";
  subscriptionManage: Subscription; 
  private navigationSubscription: Subscription;  //per la navigazione e forzare la init



  constructor( protected interfaceService: InterfaceService , protected router: Router, protected fb: FormBuilder) {super(fb)}

  get isEditEnabled(): boolean {
    return (this.editMode === 'E' || this.editMode === 'C' || this.editMode === 'I');
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.setupNavigationListener();
    this.connectionTypes = enumToSelectOptions(ConnectionTypeEnum);
    this.initializeComponent();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
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
          this.interfaceService.emitClearAfetrDelete();
        break;
      case 'C':
        this.addItem(formValue);
        break;
      case 'E':
          this.updateItem(formValue);
          this.interfaceService.emitResetAfetrUpdate(formValue);
          break;
      default:
          break;
     }
    this.closeModal.emit();
  }

  submitItem(mode: string){
      this.manualErrors.length = 0;
      const id = this.form.get('id')?.value;

      if (mode === 'I' || mode === 'C' ) {
        this.interfaceService.getInterface(id).subscribe({
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
      const m = new InterfaceStruct(this.form.value);
      switch (mode) {
        case 'I': this.interfaceService.addItem(m); break;
        case 'C': this.interfaceService.addItem(m); break;
        case 'E': 
          this.interfaceService.updateItem(m); 
          this.interfaceService.emitResetAfetrUpdate(m);
          break;
        case 'D':
          this.interfaceService.deleteItem(m);
          this.interfaceService.emitClearAfetrDelete();
          break;
      }
      this.closeModal.emit();
    }
  }


/****************************************
* Metodi generici di preparazione item
* 
******************************************/
  setItem(formValue : any) : InterfaceStruct {
    return  new InterfaceStruct({
      id: formValue.id,
      description: formValue.description,
      connectionType: formValue.connectionType,
      passiveMode: formValue.passiveMode,
      secureFtp: formValue.secureFtp,
      host: formValue.host,
      port: formValue.port,
      user: formValue.user,
      password: formValue.password,
      sftpAlias: formValue.sftpAlias,
      knownHost: formValue.knownhost,
      keyFile: formValue.keyFile,
      trustHost: formValue.trustHost,
      enabled: formValue.enabled,
      note: formValue.note
    });
  }

  addItem(formValue : any){
    console.log("Valori arrivati dal form di inserimento:", JSON.stringify(formValue));
    this.interfaceService.addItem(this.setItem(formValue));
  }

  deleteItem(formValue : any){
    this.interfaceService.deleteItem(this.setItem(formValue));
  }

  updateItem(formValue : any){
    this.interfaceService.updateItem(this.setItem(formValue));
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
  
    this.subscriptionManage = this.interfaceService.manageItem.subscribe(
      (event: {item: any, mode: string}) => {
        var selectedItem = event.item as InterfaceStruct;
        this.editMode=event.mode;

        if (!this.form) { return; }

        setTimeout(() => {
            if (event.mode != "" && event.mode !="I" ) {
              this.idItem=selectedItem.id;
              this.form.patchValue({

                id: selectedItem.id,
                description: selectedItem.description,
                connectionType: selectedItem.connectionType,
                passiveMode: selectedItem.passiveMode,
                secureFtp:selectedItem.secureFtp,
                host:selectedItem.host,
                port:selectedItem.port,
                user:selectedItem.user,
                password: selectedItem.password,
                sftpAlias: selectedItem.sftpAlias,
                knownhost: selectedItem.knownHost,
                keyFile: selectedItem.keyFile,
                trustHost: selectedItem.trustHost,
                enabled:selectedItem.enabled,
                note:selectedItem.note

              })
            
            }
            if (event.mode ==="I"){
              this.form.reset({

                id: '',
                description: '',
                connectionType: '',
                passiveMode: 'N',
                secureFtp:'N',
                host:'',
                port:'',
                user:'',
                password: '',
                sftpAlias: '',
                knownhost: '',
                keyFile: '',
                trustHost: 'N',
                enabled:'S',
                note:''
              });

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

  
  /*********************************************/
  /*       metodi di per controlli  del form   */
  /*********************************************/ 



  /*********************************************/
  /*       metodi di controllo del form        */
  /*********************************************/ 
  protected getControlsConfig() {
    return {
      id:         ['', [Validators.required, Validators.maxLength(20)]],
      description:[''],
      connectionType: ['', Validators.required],
      passiveMode: ['N'],
      secureFtp:['N'],
      host:['', Validators.required],
      port:['', Validators.required],
      user:[''],
      password: [''],
      sftpAlias: [''],
      knownhost: [''],
      keyFile: [''],
      trustHost: ['N'],
      enabled:['S'],
      note:['']
    };
  }
  


   /** Validator di form group per i campi specifici */
  protected getCrossFieldValidator(): ValidatorFn {
    return (group: AbstractControl) => {
      const errs: any = {};
      const t = group.get('connectionType')?.value;
      
      if (t === 'S' ) {
        if (!group.get('password')?.value && !group.get('keyFile')?.value ) errs.sftpKeyOrPasswordRequired = true;
        if (!group.get('knownhost')?.value) errs.knownhostRequired = true;
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
    if (c.id.errors?.required)      errs.push('ID is mandatory');
    if (c.connectionType.errors?.required)      errs.push('Connection Type is mandatory');
    if (c.host.errors?.required) errs.push('Host is mandatory');
    if (c.port.errors?.required) errs.push('Port is mandatory');

    const gf = this.form.errors;
    if (gf?.sftpKeyOrPasswordRequired) errs.push('Either a password or a connection is required');  
    if (gf?.knownhostRequired) errs.push('Knownhost is required');  

    return errs;
  }


   /** Quando cambia un valore, azzero/disabilito i campi correlati */
  protected onFormChanges() {
    const g = this.form;
  }





}
