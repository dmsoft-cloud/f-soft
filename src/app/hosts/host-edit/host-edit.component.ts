import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { filter, Subscription } from 'rxjs';
import { HostService } from '../host.service';
import { NavigationEnd, Router } from '@angular/router';
import { HostStruct } from '../../utils/structs/hostStruct';
import { GenericEditComponent } from '../../utils/generic-edit/generic-edit.component';

@Component({
  selector: 'dms-host-edit',
  templateUrl: './host-edit.component.html',
  styleUrl: './host-edit.component.css'
})
export class HostEditComponent extends GenericEditComponent implements OnInit, OnDestroy {

  @Output() closeModal = new EventEmitter();
  @Input() componentDescription: string = "";
  @ViewChild('manageForm', { static: false }) manageForm: NgForm;
  editMode : string = "";
  idItem : number = 0;
  subscriptionManage: Subscription; 
  private navigationSubscription: Subscription;  //per la navigazione e forzare la init


  constructor( private hostService: HostService, private router: Router) {super()}

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
    console.log("valore Form:  ");
    console.log(formValue);
    switch (mode) {
      case 'I':
        this.addItem(formValue);
        break;
      case 'D':
        this.deleteItem(formValue);
        this.hostService.emitClearAfetrDelete();
        break;
      case 'C':
        this.addItem(formValue);
        break;
      case 'E':
        this.updateItem(formValue);
        this.hostService.emitResetAfetrUpdate(formValue);
        break;
      default:
        break;
    }
    this.closeModal.emit();
    //this.genericDetailComponent.closeModal();
    /*modal.close();
    */
  }

  addItem(formValue : any){
    const newHost = new HostStruct(
      formValue.id,
      formValue.name,
      formValue.description,
      formValue.host,
      formValue.remote,
      formValue.type,
      formValue.status,
      formValue.notes
    );
  
    this.hostService.addItem(newHost);

  }

  deleteItem(formValue : any){
    const newHost = new HostStruct(
      formValue.id,
      formValue.name,
      formValue.description,
      formValue.host,
      formValue.remote,
      formValue.type,
      formValue.status,
      formValue.notes
    );
    this.hostService.deleteItem(newHost);
  }

  updateItem(formValue : any){
    const newHost = new HostStruct(
      formValue.id,
      formValue.name,
      formValue.description,
      formValue.host,
      formValue.remote,
      formValue.type,
      formValue.status,
      formValue.notes
    );
    this.hostService.updateItem(newHost);

  }

  submitForm(form: NgForm) {
    if (this.editMode === 'E') {
      form.value.id = this.idItem;  // Assegna il valore manualmente
    }

    if (form) {
      form.ngSubmit.emit();
    }
  }

  prepareItem(formValue : any) : any {
    //console.log(formValue);
    const newHost = new HostStruct(
      formValue.id,
      formValue.name,
      formValue.description,
      formValue.host,
      formValue.remote,
      formValue.type,
      formValue.status,
      formValue.notes
    );
  }



  private onNavigationEnd(): void {
    // Logica che vuoi eseguire ogni volta che c'è una navigazione
    this.initializeComponent();
  }

  private initializeComponent(): void {
    
    this.subscriptionManage = this.hostService.manageItem.subscribe(
      (event: {item: any, mode: string}) => {
          var selectedItem = event.item as HostStruct;
          this.editMode=event.mode;
          //console.log('modalità: ' + event.mode)
          
          setTimeout(() => {

                if (event.mode != "" && event.mode !="I" ) {
                  this.idItem = selectedItem.id;
                  this.manageForm.setValue({
                    
                    id: selectedItem.id,
                    name: selectedItem.name,
                    description: selectedItem.description,
                    host: selectedItem.host,
                    remote: selectedItem.remote,
                    type: selectedItem.type,
                    status:selectedItem.status,
                    notes:selectedItem.notes
                  })
                
                }
                if (event.mode ==="I"){
                  this.manageForm.reset();
                  this.manageForm.setValue({

                    id: 0,
                    name: '',
                    description: '',
                    host:'',
                    remote: '',
                    type: '',
                    status:'S',
                    notes:''
                  })
                }
          }, );

      } 

    );

  }


}
