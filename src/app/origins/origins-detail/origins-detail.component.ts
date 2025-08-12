import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { OriginStruct } from '../../utils/structs/originStruct';
import { NgForm } from '@angular/forms';
import { GenericDetailComponent } from '../../utils/generic-detail/generic-detail.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OriginService } from '../../origins/origin.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'dms-origins-detail',
    templateUrl: './origins-detail.component.html',
    styleUrl: './origins-detail.component.css',
    standalone: false
})
export class OriginsDetailComponent extends GenericDetailComponent implements OnInit, OnDestroy {
  subscription: Subscription; 
  subscriptionManage: Subscription; 
  

  @ViewChild('quickEditForm', { static: false }) quickEditForm: NgForm;
  @ViewChild('insertForm', { static: false }) insertForm: NgForm;
  
  @ViewChild(GenericDetailComponent) genericDetailComponent!: GenericDetailComponent;
  
  quickModeAcive: boolean; //serve a indicare se è attiva la modalità di modifica quick mode

  connectionType: string=""; //tipo di connessione per l'elemento

  //usato per popolare i bottoni e le etichette generiche
  @Input() buttonDescriptionD: string = "Default Description";

  // Definisci la variabile per memorizzare l'ID che vuoi inviare nel form
  q_id: string = "";

  constructor( modalServiceF: NgbModal, elF: ElementRef, private  http: HttpClient, private originService: OriginService,
                private router: Router, private route: ActivatedRoute){

    super(modalServiceF, elF);
  }
  
  ngOnInit(): void {
    this.subscription = this.originService.startedEditing.subscribe(
      (event: {item: any, mode: string}) => {
          var selectedItem = event.item as OriginStruct;

          // Imposta l'ID nella variabile q_id
          this.q_id = selectedItem.id;
          this.setAuditlog(selectedItem);
          this.quickEditForm.setValue({
            id: selectedItem.id,
            dbType: selectedItem.dbType,
            description: selectedItem.description,
            status: selectedItem.enabled,
            host: selectedItem.ip,
            jdbc_custom_string: selectedItem.jdbcCustomString,
            notes: selectedItem.note,
            password: selectedItem.password,
            port: selectedItem.port,
            secure: selectedItem.secure,
            user: selectedItem.user
          });
          this.toggleQuickEdit(false);
      } 
    );
    
    this.originService.clearAfetrDeleteObservable$.subscribe(
      () =>  {
        this.resetForm();
      }
    );

    this.originService.resetAfetrUpdateObservable$.subscribe(
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
  }

  resetForm() {
    // Reset dei campi del form
    this.quickEditForm.resetForm();
  }
  
  updateForm(item : OriginStruct) {
    // Update dei campi del form
    this.quickEditForm.setValue({
      id: item.id,
      dbType: item.dbType,
      description: item.description,
      status: item.enabled,
      host: item.ip,
      jdbc_custom_string: item.jdbcCustomString,
      notes: item.note,
      password: item.password,
      port:  item.port,
      secure: item.secure,
      user: item.user
    })
  }

  onCreatePost(formValue : any){

    const newOrigin = new OriginStruct({
      id: this.q_id,
      dbType: formValue.dbType,
      description: formValue.description,
      enabled: formValue.status,
      ip: formValue.host,
      jdbcCustomString: formValue.jdbc_custom_string,
      note: formValue.notes,
      password: formValue.password,
      port: formValue.port,
      secure: formValue.secure,
      user: formValue.user
    });

    this.originService.updateItem(newOrigin);  //da sostituire con la chiamata al servizio da invocare
    this.genericDetailComponent.closeModal();

    this.toggleQuickEdit(false);
    //this.genericDetailComponent.toggleQuickEdit(false); 

  }
  
  onManageItem(event : {item: any, mode: string}): void {
    this.originService.manageItem.next(event);
  }


}
