import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { filter, Subscription } from 'rxjs';
import { AbstractControl, FormBuilder, FormGroup, NgForm, ValidatorFn, Validators } from '@angular/forms';

import { ModelStruct } from '../../utils/structs/modelStruct';
import { NavigationEnd, Router } from '@angular/router';
import { GenericEditComponent } from '../../utils/generic-edit/generic-edit.component';
import { ModelService } from '../model.service';
import { enumToSelectOptions, SelectOption } from '../../utils/select-custom/select-option.model';

import { DirectionEnum, FileFormatEnum, LocaleEnum, RecordDelimiterTypeEnum, StringDelimiterTypeEnum, TypeEnum } from '../../utils/baseEntity';
import { BaseEditComponent } from '../../utils/base-edit/base-edit.component';
import { JsonPipe } from '@angular/common';


@Component({
    selector: 'dms-models-edit',
    templateUrl: './models-edit.component.html',
    styleUrl: './models-edit.component.css',
    standalone: false
})
export class ModelsEditComponent extends BaseEditComponent implements OnInit, OnDestroy  {

  @Input() record: ModelStruct | null = null; 
  @Output() invalidFields = new EventEmitter<string[]>();
  showExportSection: boolean = false;
  manualErrors: string[] = [];

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
  recordDelimiter: string="";
  recordDelimiters: SelectOption[] = [];
  stringDelimiter: string="";
  stringDelimiters: SelectOption[] = [];

  editMode : string = "";
  idItem : string = "";
  subscriptionManage: Subscription; 
  private navigationSubscription: Subscription;  //per la navigazione e forzare la init

    // Form principale con form annidati
    //manageForm: FormGroup;


    //campi per controlli
    database: string = '';
    schema: string = '';
    compression: string = 'N';
    decompression: string = 'N';


  constructor( protected modelService: ModelService, protected router: Router, protected cd: ChangeDetectorRef, protected fb: FormBuilder) {super(fb)}

  get isEditEnabled(): boolean {
    return (this.editMode === 'E' || this.editMode === 'C' || this.editMode === 'I');
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.setupNavigationListener();
    this.types = enumToSelectOptions(TypeEnum);
    this.directions = enumToSelectOptions(DirectionEnum);
    this.localeList = enumToSelectOptions(LocaleEnum);
    this.fileFormats = enumToSelectOptions(FileFormatEnum);
    this.recordDelimiters = enumToSelectOptions(RecordDelimiterTypeEnum);
    this.stringDelimiters = enumToSelectOptions(StringDelimiterTypeEnum);
    
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

  submitItem(mode: string){
      this.manualErrors.length = 0;
      const id = this.form.get('id')?.value;

      if (mode === 'I' || mode === 'C' ) {
        this.modelService.getModel(id).subscribe({
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
      console.log(this.form.getRawValue());
      const m = new ModelStruct(this.form.getRawValue()); //uso getRawValue per passare anche i valori disabled
      switch (mode) {
        case 'I': this.modelService.addItem(m); break;
        case 'C': this.modelService.addItem(m); break;
        case 'E': 
          this.modelService.updateItem(m); 
          this.modelService.emitResetAfetrUpdate(m);
          break;
        case 'D':
          this.modelService.deleteItem(m);
          this.modelService.emitClearAfetrDelete();
          break;
      }
      this.closeModal.emit();
    }
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

  protected initializeComponent(): void {
    
    this.subscriptionManage = this.modelService.manageItem.subscribe(
      (event: {item: any, mode: string}) => {
          var selectedItem = event.item as ModelStruct;
          this.editMode=event.mode;
          //console.log('modalità: ' + event.mode)

          // Assicuriamoci che il FormGroup sia già stato creato da super.ngOnInit()
          if (!this.form) { return; }
          
          setTimeout(() => {

                if (event.mode != "" && event.mode !="I" ) {
                  this.idItem = selectedItem.id;
                  this.form.patchValue({
                        id:               selectedItem.id,
                        description:      selectedItem.description,
                        note:             selectedItem.note,
                        enabled:          selectedItem.enabled,
                        type:             selectedItem.type,
                        direction:        selectedItem.direction,
                        decompression:    selectedItem.decompression,
                        compression:      selectedItem.compression,
                        sendMail:         selectedItem.sendMail,
                        retry:            selectedItem.retry,
                        retryInterval:    selectedItem.retryInterval,
                        retention:        selectedItem.retention,
                        internationalization: selectedItem.internationalization,
                        deleteFile:       selectedItem.deleteFile,
                        uniqueHash:       selectedItem.uniqueHash,
                        fetchSize:        selectedItem.fetchSize,
                        database:         selectedItem.database,
                        schema:           selectedItem.schema,
                        sourceCharset:    selectedItem.sourceCharset,
                        destCharset:      selectedItem.destCharset,
                        fileFormat:       selectedItem.fileFormat,
                        header:           selectedItem.header,
                        recordDelimiter:  selectedItem.recordDelimiter,
                        fieldDelimiter:   selectedItem.fieldDelimiter,
                        stringDelimiter:  selectedItem.stringDelimiter,
                        removingSpaces:   selectedItem.removingSpaces,
                        numericFilling:   selectedItem.numericFilling,
                        integrityCheck:   selectedItem.integrityCheck,
                        createFile:       selectedItem.createFile
                      });           
                     console.log('form  dopo fase di setting con rowValue: ' +  JSON.stringify( this.form.getRawValue()));       
                      this.showExportSection  = selectedItem.type === 'D' ? true : false;                      
                }
                if (event.mode ==="I"){
                  this.form.reset({
                      id:               '',
                      description:      '',
                      note:             '',
                      enabled:          'S',
                      type:             '',
                      direction:        '',
                      decompression:    'N',
                      compression:      'N',
                      sendMail:         'N',
                      retry:            0,
                      retryInterval:    0,
                      retention:        0,
                      internationalization: '',
                      deleteFile:       'N',
                      uniqueHash:       'N',
                      fetchSize:        0,
                      database:         '',
                      schema:           '',
                      sourceCharset:    '',
                      destCharset:      '',
                      fileFormat:       '',
                      header:           'N',
                      recordDelimiter:  '',
                      fieldDelimiter:   '',
                      stringDelimiter:  '',
                      removingSpaces:   '',
                      numericFilling:   0,
                      integrityCheck:   'N',
                      createFile:       'N'
                    });

                  this.activeTab = 'basicData';
                  this.showExportSection= false;
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
  onTypeChange(newType: string) {
    if (newType !== 'D') {
      this.database = '';
      this.schema  = '';
    }
  }

  onDirectionChange(newDir: string) {
    if (newDir === 'I') {
      this.form.value.compression = 'N';
    }
  }


  /*********************************************/
  /*       metodi di controllo del form        */
  /*********************************************/ 
  protected getControlsConfig() {
    return {
      id:         ['', [Validators.required, Validators.maxLength(20)]],
      description:[''],
      note:[''],
      enabled:    ['S'],
      sendMail:   ['N'],
      type:       ['', Validators.required],
      direction:  ['', Validators.required],
      decompression: ['N'],
      compression:   ['N'],
      retry:      [0],
      retryInterval: [0],
      retention:  [0],
      internationalization: [''],
      deleteFile: ['N'],
      uniqueHash: ['N'],
      fetchSize: [0],
      database:  [''],   
      schema:    [''],   
      sourceCharset:[''],
      destCharset:[''],
      fileFormat:[''],
      header:   ['N'],
      recordDelimiter:[''],
      fieldDelimiter:[''],
      stringDelimiter:[''],
      removingSpaces:[''],
      numericFilling:[''],
      integrityCheck:['N'],
      createFile:['N']
    };
  }
  


   /** Validator di form group per i campi specifici */
  protected getCrossFieldValidator(): ValidatorFn {
    return (group: AbstractControl) => {
      const t = group.get('type')?.value;
      const errs: any = {};
      if (t === 'D') {
        if (!group.get('database')?.value) errs.databaseRequired = true;
        if (!group.get('schema')?.value)   errs.schemaRequired   = true;
        if (!group.get('internationalization')?.value) errs.internationalizationRequired = true;
        if (!group.get('fileFormat')?.value)           errs.fileFormatRequired         = true;
        if (!group.get('recordDelimiter')?.value)      errs.recordDelimiterRequired    = true;
        if (!group.get('fieldDelimiter')?.value)       errs.fieldDelimiterRequired     = true;
        if (!group.get('stringDelimiter')?.value)      errs.stringDelimiterRequired    = true;
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
    if (c.type.errors?.required)      errs.push('Type is mandatory');
    if (c.direction.errors?.required) errs.push('Direction is mandatory');

    const gf = this.form.errors;
    if (gf?.databaseRequired) errs.push('Database is mandatory');
    if (gf?.schemaRequired)   errs.push('Schema is mandatory');
    if (gf?.internationalizationRequired) errs.push('Internationalization is mandatory');
    if (gf?.fileFormatRequired)           errs.push('File Format is mandatory');
    if (gf?.recordDelimiterRequired)      errs.push('Record Delimiter is mandatory');
    if (gf?.fieldDelimiterRequired)       errs.push('Field Delimiter is mandatory');
    if (gf?.stringDelimiterRequired)      errs.push('String Delimiter is mandatory');


    return errs;
  }


   /** Quando cambia un valore, azzero/disabilito i campi correlati */
  protected onFormChanges() {
    const g = this.form;
    // se cambio type ≠ 'D', azzero database/schema
    if (g.get('type')?.value !== 'D') {
      g.patchValue({ database: '', schema: '' }, { emitEvent: false });
      this.showExportSection = false;
    }

    if (g.get('type')?.value === 'D') {
      this.showExportSection = true;
    }
    

    // se direction = 'I', disabilito compression
    if (g.get('direction')?.value === 'I') {
      g.get('compression')?.disable({ emitEvent: false });
      g.get('compression')?.setValue('N', { emitEvent: false });
      g.value.compression = 'N';
    } else {
      g.get('compression')?.enable({ emitEvent: false });
    }

    // se direction = 'O', disabilito decompression
    if (g.get('direction')?.value === 'O') {
      g.get('decompression')?.disable({ emitEvent: false });
      g.get('decompression')?.setValue('N', { emitEvent: false });
      g.value.decompression = 'N';
    } else {
      g.get('decompression')?.enable({ emitEvent: false });
    }
  }




}
