import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { filter, Subscription } from 'rxjs';
import { AbstractControl, FormBuilder, NgForm, ValidatorFn, Validators } from '@angular/forms';
import { OriginService } from '../origin.service';
import { OriginStruct } from '../../utils/structs/originStruct';
import { NavigationEnd, Router } from '@angular/router';
import { GenericEditComponent } from '../../utils/generic-edit/generic-edit.component';
import { BaseEditComponent } from '../../utils/base-edit/base-edit.component';
import { enumToSelectOptions, SelectOption } from '../../utils/select-custom/select-option.model';
import { DbTypeEnum } from '../../utils/baseEntity';

@Component({
    selector: 'dms-origin-edit',
    templateUrl: './origin-edit.component.html',
    styleUrl: './origin-edit.component.css',
    standalone: false
})
export class OriginEditComponent extends BaseEditComponent implements OnInit, OnDestroy  {

  @Input() record: OriginStruct | null = null; 
  @Output() invalidFields = new EventEmitter<string[]>();
  showExportSection: boolean = false;
  manualErrors: string[] = [];


  @Output() closeModal = new EventEmitter();
  @Input() componentDescription: string = "";
  @ViewChild('manageForm', { static: false }) manageForm: NgForm;
  editMode : string = "";
  idItem : string = "";
  subscriptionManage: Subscription; 
  private navigationSubscription: Subscription;  //per la navigazione e forzare la init

  //capi per select fields
  dbType: string=""; 
  dbTypes: SelectOption[] = []; 


  constructor( protected originService: OriginService, protected router: Router, protected fb: FormBuilder) {super(fb)}

  get isEditEnabled(): boolean {
    return (this.editMode === 'E' || this.editMode === 'C' || this.editMode === 'I');
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.setupNavigationListener();
    this.dbTypes = enumToSelectOptions(DbTypeEnum);
    // Logica di inizializzazione del componente figlio
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
        this.originService.emitClearAfetrDelete();
        break;
      case 'C':
        this.addItem(formValue);
        break;
      case 'E':
        this.updateItem(formValue);
        this.originService.emitResetAfetrUpdate(formValue);
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
          this.originService.getOrigin(id).subscribe({
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
        const m = new OriginStruct(this.form.value);
        switch (mode) {
          case 'I': this.originService.addItem(m); break;
          case 'C': this.originService.addItem(m); break;
          case 'E': 
            this.originService.updateItem(m); 
            this.originService.emitResetAfetrUpdate(m);
            break;
          case 'D':
            this.originService.deleteItem(m);
            this.originService.emitClearAfetrDelete();
            break;
        }
        this.closeModal.emit();
      }
    }
  

/****************************************
* Metodi generici di preparazione item
* 
******************************************/
  setItem(formValue : any) : OriginStruct {
    return  new OriginStruct({
      id: formValue.id,
      dbType: formValue.dbType,
      description: formValue.description,
      enabled: formValue.enabled,
      ip: formValue.ip,
      jdbcCustomString: formValue.jdbc_custom_string,
      note: formValue.note,
      password: formValue.password,
      port: formValue.port,
      secure: formValue.secure,
      user: formValue.user
    });
  }

  addItem(formValue : any){
    this.originService.addItem(this.setItem(formValue));
  }

  deleteItem(formValue : any){
    this.originService.deleteItem(this.setItem(formValue));
  }

  updateItem(formValue : any){
    this.originService.updateItem(this.setItem(formValue));
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
    
    this.subscriptionManage = this.originService.manageItem.subscribe(
      (event: {item: any, mode: string}) => {
          var selectedItem = event.item as OriginStruct;
          this.editMode=event.mode;
          //console.log('modalità: ' + event.mode)
          
          setTimeout(() => {

                if (event.mode != "" && event.mode !="I" ) {
                  this.idItem = selectedItem.id;
                  this.form.patchValue({
                    
                    id: selectedItem.id,
                    dbType: selectedItem.dbType,
                    description: selectedItem.description,
                    enabled:selectedItem.enabled,
                    ip: selectedItem.ip,
                    jdbcCustomString: selectedItem.jdbcCustomString,
                    note:selectedItem.note,
                    password: selectedItem.password,
                    port: selectedItem.port,
                    secure: selectedItem.secure,
                    user: selectedItem.user
                  })
                
                }
                if (event.mode ==="I"){
                  this.form.reset({

                    id: '',
                    dbType: '',
                    description: '',
                    enabled:'S',
                    ip:'',
                    jdbcCustomString: '',
                    note:'',
                    password: '',
                    port: '',
                    secure: 'N',
                    user: ''
                  })
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
  /*       metodi di controllo del form        */
  /*********************************************/ 
  onDbTypeChange(newType: string) {

  }

  
  /*********************************************/
  /*       metodi di controllo del form        */
  /*********************************************/ 
  protected getControlsConfig() {
    return {
      id:         ['', [Validators.required, Validators.maxLength(20)]],      
      dbType: ['', Validators.required],
      description:[''],
      enabled:['S'],
      ip:['', Validators.required],
      jdbcCustomString: [''],
      note:[''],
      password: [''],
      port: [''],
      secure: ['N'],
      user: ['', Validators.required]
    };
  }
  


   /** Validator di form group per i campi specifici */
  protected getCrossFieldValidator(): ValidatorFn {
    return (group: AbstractControl) => {
      const errs: any = {};

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
    if (c.dbType.errors?.required)      errs.push('Type is mandatory');
    if (c.ip.errors?.required)      errs.push('Host is mandatory');
    if (c.user.errors?.required)      errs.push('User is mandatory');
    return errs;
  }


   /** Quando cambia un valore, azzero/disabilito i campi correlati */
  protected onFormChanges() {
    const g = this.form;

  }


}
