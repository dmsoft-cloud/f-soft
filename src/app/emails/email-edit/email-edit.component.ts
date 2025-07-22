import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild,  OnChanges, SimpleChanges } from '@angular/core';
import { filter, map, Observable, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { EditorComponent } from '@tinymce/tinymce-angular';


import { NavigationEnd, Router } from '@angular/router';
import { GenericEditComponent } from '../../utils/generic-edit/generic-edit.component';

import { enumToSelectOptions, SelectOption } from '../../utils/select-custom/select-option.model';
import { EmailService } from '../email.service';
import { EmailStruct } from '../../utils/structs/emailStruct';

@Component({
    selector: 'dms-email-edit',
    templateUrl: './email-edit.component.html',
    styleUrl: './email-edit.component.css',
    standalone: false
})
export class EmailEditComponent extends GenericEditComponent implements OnInit, OnDestroy {
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
  toInput: string = "";
  ccInput: string = "";
  public bodyHtml: string = '';
  tinyMceEnabled: boolean = false; 

  constructor( private emailService: EmailService, private router: Router, private cd: ChangeDetectorRef, 
    private fb: FormBuilder ) {super()}
  
      get isEditEnabled(): boolean {
        return (this.editMode === 'E' || this.editMode === 'C' || this.editMode === 'I');
      }
  
      ngOnInit(): void {
  
        this.setupNavigationListener();
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
      console.log("modalità getione form: " + mode )
      console.log("valore Form:  ");
      console.log(formValue);
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
                    this.manageForm.setValue({                   
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
      if (this.toInput && this.isEditEnabled) {
        const newRecipient = {
          emailId: this.idItem, // Usa idItem come emailId
          emailAddress: this.toInput,
          type: 'To'
        };
        this.toRecipients.push(newRecipient);
        this.toInput = "";
      }
    }

    addCcRecipient() {
      if (this.ccInput && this.isEditEnabled) {
        const newRecipient = {
          emailId: this.idItem, // Usa idItem come emailId
          emailAddress: this.ccInput,
          type: 'CC'
        };
        this.ccRecipients.push(newRecipient);
        this.ccInput = "";
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

}
