import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription, filter } from 'rxjs';
import { NgForm } from '@angular/forms';
import { GroupService } from '../group.service';
import { GroupStruct } from '../../utils/structs/groupStruct';
import { NavigationEnd, Router } from '@angular/router';
import { GenericEditComponent } from '../../utils/generic-edit/generic-edit.component';


@Component({
  selector: 'dms-group-edit',
  templateUrl: './group-edit.component.html',
  styleUrl: './group-edit.component.css'
})
export class GroupEditComponent extends GenericEditComponent implements OnInit, OnDestroy {

  @Output() closeModal = new EventEmitter();
  @Input() componentDescription: string = "";
  @ViewChild('manageForm', { static: false }) manageForm: NgForm;
  editMode : string = "";
  idItem : string = "";
  subscriptionManage: Subscription; 
  private navigationSubscription: Subscription;  //per la navigazione e forzare la init


  constructor( private groupService: GroupService, private router: Router) {super()}

  get isEditEnabled(): boolean {
    return (this.editMode === 'E' || this.editMode === 'C' || this.editMode === 'I');
  }

  ngOnInit(): void {

    this.setupNavigationListener();
    // Logica di inizializzazione del componente figlio
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
    //console.log("valore Form:  ");
    //console.log(formValue);
    switch (mode) {
      case 'I':
        this.addItem(formValue);
        break;
      case 'D':
        this.deleteItem(formValue);
        this.groupService.emitClearAfetrDelete();
        break;
      case 'C':
        this.addItem(formValue);
        break;
      case 'E':
        this.updateItem(formValue);
        this.groupService.emitResetAfetrUpdate(formValue);
        break;
      default:
        break;
    }
    this.closeModal.emit();
  }

/****************************************
* Metodi generici di preparazione item
* 
******************************************/
    setItem(formValue : any) : GroupStruct {
      return  new GroupStruct({
        id: formValue.id,
        description: formValue.description,
        enabled: formValue.status,
        notes: formValue.notes
      });
    }
  

    addItem(formValue : any){
      this.groupService.addItem(this.setItem(formValue));
    }

    deleteItem(formValue : any){
      this.groupService.deleteItem(this.setItem(formValue));
    }

    updateItem(formValue : any){
      this.groupService.updateItem(this.setItem(formValue));
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
    
    this.subscriptionManage = this.groupService.manageItem.subscribe(
      (event: {item: any, mode: string}) => {
          var selectedItem = event.item as GroupStruct;
          this.editMode=event.mode;
          //console.log('modalità: ' + event.mode)
          
          setTimeout(() => {

                if (event.mode != "" && event.mode !="I" ) {
                  this.idItem = selectedItem.id;
                  this.manageForm.setValue({
                    
                    id: selectedItem.id,
                    description: selectedItem.description,
                    status:selectedItem.enabled,
                    notes:selectedItem.notes
                  })
                
                }
                if (event.mode ==="I"){
                  this.manageForm.reset();
                  this.manageForm.setValue({

                    id: '',
                    description: '',
                    status:'S',
                    notes:''
                  })
                }
          }, );

      } 

    );

  }

}
