import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { GroupStruct } from '../../utils/structs/groupStruct';
import { NgForm } from '@angular/forms';
import { GenericDetailComponent } from '../../utils/generic-detail/generic-detail.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GroupService } from '../group.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
    selector: 'dms-groups-detail',
    templateUrl: './groups-detail.component.html',
    styleUrl: './groups-detail.component.css',
    standalone: false
})
export class GroupsDetailComponent extends GenericDetailComponent implements OnInit, OnDestroy {
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
  

  constructor( modalServiceF: NgbModal, elF: ElementRef, private  http: HttpClient, private groupService: GroupService,
                private router: Router, private route: ActivatedRoute){

    super(modalServiceF, elF);
    //console.log('buttonDescription in InterfacesDetailComponent:', this.buttonDescriptionD); // Log per debug
  }
  
  ngOnInit(): void {
    this.subscription = this.groupService.startedEditing.subscribe(
      (event: {item: any, mode: string}) => {
          var selectedItem = event.item as GroupStruct;

          // Imposta l'ID nella variabile q_id
          this.q_id = selectedItem.id;
          this.setAuditlog(selectedItem);
          this.quickEditForm.setValue({
            id: selectedItem.id,
            description: selectedItem.description,
            notes: selectedItem.notes,
            status: selectedItem.enabled
          })
      } 
    );

    this.groupService.clearAfetrDeleteObservable$.subscribe(
      () =>  {
        this.resetForm();
      }
    );

    this.groupService.resetAfetrUpdateObservable$.subscribe(
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
  
  updateForm(item : GroupStruct) {
    // Update dei campi del form
    this.quickEditForm.setValue({
      id: item.id,
      description: item.description,
      notes: item.notes,
      status: item.enabled
    })
  }

  onCreatePost(formValue : any){

    const newGroup = new GroupStruct({
      id: this.q_id,
      description: formValue.description,
      enabled: formValue.status,
      notes: formValue.notes
    });

    this.groupService.updateItem(newGroup);  //da sostituire con la chiamata al servizio da invocare
    this.genericDetailComponent.closeModal();

    this.toggleQuickEdit(false);
    this.genericDetailComponent.toggleQuickEdit(false); 
    //this.genericDetailComponent.isQuickEditEnabled=false;

  }
  
  onManageItem(event : {item: any, mode: string}): void {
    this.groupService.manageItem.next(event);
  }

}
