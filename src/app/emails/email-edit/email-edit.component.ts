import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild,  OnChanges, SimpleChanges } from '@angular/core';
import { filter, map, Observable, Subscription } from 'rxjs';
import { AbstractControl, FormBuilder, FormGroup, NgForm, ValidatorFn, Validators } from '@angular/forms';
import { EditorComponent } from '@tinymce/tinymce-angular';


import { NavigationEnd, Router } from '@angular/router';
import { GenericEditComponent } from '../../utils/generic-edit/generic-edit.component';

import { enumToSelectOptions, SelectOption } from '../../utils/select-custom/select-option.model';
import { EmailService } from '../email.service';
import { EmailStruct } from '../../utils/structs/emailStruct';
import { BaseEditComponent } from '../../utils/base-edit/base-edit.component';

@Component({
    selector: 'dms-email-edit',
    templateUrl: './email-edit.component.html',
    styleUrl: './email-edit.component.css',
    standalone: false
})
export class EmailEditComponent extends BaseEditComponent implements OnInit, OnDestroy {

  @Input() record: EmailStruct | null = null; 
  @Output() invalidFields = new EventEmitter<string[]>();
  manualErrors: string[] = [];

  @Output() closeModal = new EventEmitter();
  @Input() componentDescription: string = "";
  @ViewChild('manageForm', { static: false }) manageForm: NgForm;
  @ViewChild(EditorComponent) tinyMceEditor?: EditorComponent;
  
  activeTab: string = 'basicData';  //serve per vedere quale tab è attivo tra quelli presenti
  
  @Input() item: any ={};
  @Input() editMode : string = "";
  idItem : string = "";
  subscriptionManage: Subscription; 
  private navigationSubscription: Subscription;  //per la navigazione e forzare la init

  toRecipients: { emailId: string; emailAddress: string; type: string }[] = [];
  ccRecipients: { emailId: string; emailAddress: string; type: string }[] = [];
  public bodyHtml: string = '';
  tinyMceEnabled: boolean = false; 

  constructor( private emailService: EmailService, private router: Router, private cd: ChangeDetectorRef, 
    protected fb: FormBuilder ) {super(fb)}
  
      get isEditEnabled(): boolean {
        return (this.editMode === 'E' || this.editMode === 'C' || this.editMode === 'I');
      }
  
      ngOnInit(): void {
        super.ngOnInit();
        this.setupNavigationListener();
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
      switch (mode) {
        case 'I':
          this.addItem(formValue);
          break;
        case 'D':
          this.deleteItem(formValue);
          this.emailService.emitClearAfetrDelete();
          break;
        case 'C':
          this.addItem(formValue);
          break;
        case 'E':
          this.updateItem(formValue);
          this.emailService.emitResetAfetrUpdate(formValue);
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
            this.emailService.getEmail(id).subscribe({
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
          const m = this.setItem(this.form.value);
          switch (mode) {
            case 'I': this.emailService.addItem(m); break;
            case 'C': this.emailService.addItem(m); break;
            case 'E': 
              this.emailService.updateItem(m); 
              this.emailService.emitResetAfetrUpdate(m);
              break;
            case 'D':
              this.emailService.deleteItem(m);
              this.emailService.emitClearAfetrDelete();
              break;
          }
          this.closeModal.emit();
        }
      }
    

/****************************************
* Metodi generici di preparazione item
* 
******************************************/

setItem(formValue : any) : EmailStruct {
  // Unione di toRecipients e ccRecipients in un unico array
  const recipients = [
    ...this.toRecipients.map(recipient => ({emailId: formValue.id, emailAddress: recipient.emailAddress, type: "TO"  })), 
    ...this.ccRecipients.map(recipient => ({ emailId: formValue.id, emailAddress: recipient.emailAddress, type: "CC"   })) 
  ];

  console.log("valore delle mail da inserire: " + JSON.stringify(recipients));
  return  new EmailStruct(
    formValue.id,
    formValue.subject,
    formValue.bodyHtml,
    formValue.enabled,
    formValue.note,
    recipients
  );
}

addItem(formValue : any){
  this.emailService.addItem(this.setItem(formValue));
}

deleteItem(formValue : any){
  this.emailService.deleteItem(this.setItem(formValue));
}

updateItem(formValue : any){
  this.emailService.updateItem(this.setItem(formValue));
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
      this.subscriptionManage = this.emailService.manageItem.subscribe(
        (event: {item: any, mode: string}) => {
            var selectedItem = event.item as EmailStruct;
            this.editMode=event.mode;
            //console.log('modalità: ' + event.mode)
            
            setTimeout(() => {

                  if (event.mode != "" && event.mode !="I" ) {
                    this.idItem = selectedItem.id;
                    this.toRecipients = selectedItem.recipients.filter(r => r.type === 'TO');
                    this.ccRecipients = selectedItem.recipients.filter(r => r.type === 'CC');
                    this.form.patchValue({                   
                      id: selectedItem.id,
                      subject: selectedItem.subject,
                      bodyHtml: selectedItem.bodyHtml,
                      enabled: selectedItem.enabled,
                      note: selectedItem.note,
                      toRecipients: [],  
                      ccRecipients: []  
                    })
                  
                  }
                  if (event.mode ==="I"){
                    this.toRecipients=[];
                    this.ccRecipients=[];
                    this.manageForm.reset();
                    this.manageForm.setValue({

                      id: "",
                      subject: "",
                      bodyHtml: "",
                      enabled: "S",
                      note: "",
                      toRecipients: [],  
                      ccRecipients: [] 
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

      this.emailService.manageItem.next({item: this.item, mode: this.editMode});
    }


/****************************************
* Metodi gestione destinatari
*  specifici per la classe
******************************************/

    addToRecipient() {
      if (this.form.get('toInput')?.value != '' && this.isEditEnabled) {
        const newRecipient = {
          emailId: this.idItem, // Usa idItem come emailId
          emailAddress: this.form.get('toInput')?.value,
          type: 'To'
        };
        this.toRecipients.push(newRecipient);
        this.form.patchValue({
          toInput:''
        });
      }
    }

    addCcRecipient() {
      if (this.form.get('ccInput')?.value != '' && this.isEditEnabled) {
        const newRecipient = {
          emailId: this.idItem, // Usa idItem come emailId
          emailAddress: this.form.get('ccInput')?.value,
          type: 'CC'
        };
        this.ccRecipients.push(newRecipient);
        this.form.patchValue({
          ccInput:''
        });
      }
    }

    removeToRecipient(recipient: { emailId: string; emailAddress: string; type: string }) {
      this.toRecipients = this.toRecipients.filter(r => r.emailAddress !== recipient.emailAddress);
    }

    removeCcRecipient(recipient: { emailId: string; emailAddress: string; type: string }) {
      this.ccRecipients = this.ccRecipients.filter(r => r.emailAddress !== recipient.emailAddress);
    }




/****************************************
* Metodi di gestione editor
*  
******************************************/
    getEditorConfig() {
      const isReadOnly = this.editMode === 'S';
    
      return {
        readonly: isReadOnly,
        menubar: isReadOnly ? false : 'file edit view insert format tools table help',
        toolbar: isReadOnly ? false : 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
        plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
        branding: false,  // Nasconde "Powered by TinyMCE"
        statusbar: false, // Nasconde il word count e altri elementi in basso
        height: 400
      };
    }

  
     /*********************************************/
  /*       metodi di controllo del form        */
  /*********************************************/ 
  protected getControlsConfig() {
    return {
      id:         ['', [Validators.required, Validators.maxLength(20)]],
      subject:['', [Validators.required]],
      bodyHtml:[''],
      enabled:['S'],
      note:[''],
      toInput:[''],
      ccInput:['']
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
   
    return errs;
  }


   /** Quando cambia un valore, azzero/disabilito i campi correlati */
  protected onFormChanges() {
    const g = this.form;
  }

}
