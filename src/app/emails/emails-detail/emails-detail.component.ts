import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GenericDetailComponent } from '../../utils/generic-detail/generic-detail.component';
import { SelectOption } from '../../utils/select-custom/select-option.model';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { EmailService } from '../email.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailStruct } from '../../utils/structs/emailStruct';

@Component({
    selector: 'dms-emails-detail',
    templateUrl: './emails-detail.component.html',
    styleUrl: './emails-detail.component.css',
    standalone: false
})
export class EmailsDetailComponent extends GenericDetailComponent implements OnInit, OnDestroy {

  subscription: Subscription; 
  subscriptionManage: Subscription; 
  

  @ViewChild('quickEditForm', { static: false }) quickEditForm: NgForm;
  @ViewChild('insertForm', { static: false }) insertForm: NgForm;
  
  @ViewChild(GenericDetailComponent) genericDetailComponent!: GenericDetailComponent;

  quickModeAcive: boolean; //serve a indicare se è attiva la modalità di modifica quick mode

  //usato per popolare i bottoni e le etichette generiche
  @Input() buttonDescriptionD: string = "Default Description";

  // Definisci la variabile per memorizzare l'ID che vuoi inviare nel form
  q_id: string = "";

  /**************************per inizializzazione componente******************************************************/ 
  showEmailEdit: boolean = false;

  constructor( modalServiceF: NgbModal, elF: ElementRef, private  http: HttpClient, private emailService: EmailService,
                private router: Router, private route: ActivatedRoute){

    super(modalServiceF, elF);
    //console.log('buttonDescription in InterfacesDetailComponent:', this.buttonDescriptionD); // Log per debug
  }
  
  ngOnInit(): void {
    this.subscription = this.emailService.startedEditing.subscribe(
      (event: {item: any, mode: string}) => {
          var selectedItem = event.item as EmailStruct;

          // Imposta l'ID nella variabile q_id
          this.q_id = selectedItem.id;
          this.quickEditForm.setValue({
            id: selectedItem.id,
            subject: selectedItem.subject,
            bodyHtml: selectedItem.bodyHtml,
            enabled: selectedItem.enabled,
            note: selectedItem.note,
            recipients: selectedItem.recipients         
          });
          this.toggleQuickEdit(false);
      } 
    );

    this.emailService.clearAfetrDeleteObservable$.subscribe(
      () =>  {
        this.resetForm();
      }
    );

    this.emailService.resetAfetrUpdateObservable$.subscribe(
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
    this.showEmailEdit = false;
  }


  resetForm() {
    // Reset dei campi del form
    this.quickEditForm.resetForm();
  }
  
  updateForm(item : EmailStruct) {
    // Update dei campi del form
    this.quickEditForm.setValue({
      id: item.id,
      subject: item.subject,
      bodyHtml: item.bodyHtml,
      enabled: item.enabled,
      note: item.note,
      recipients: []
    })
  }

  onCreatePost(formValue : any){
    console.log(formValue);
    const newEmail = new EmailStruct(
      this.q_id,
      formValue.subject,
      formValue.bodyHtml,
      formValue.enabled,
      formValue.note,
      formValue.recipients,

    );

    this.emailService.updateItem(newEmail);  //da sostituire con la chiamata al servizio da invocare
    this.genericDetailComponent.closeModal();
    this.toggleQuickEdit(false);
    //this.genericDetailComponent.toggleQuickEdit(false); 
  }
  
  onManageItem(event : {item: any, mode: string}): void {
    setTimeout(() => {
      this.emailService.manageItem.next(event);
      this.showEmailEdit = true;
    });

  }


}
