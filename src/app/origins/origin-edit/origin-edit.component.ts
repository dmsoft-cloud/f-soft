import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { filter, Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { OriginService } from '../origin.service';
import { OriginStruct } from '../../utils/structs/originStruct';
import { NavigationEnd, Router } from '@angular/router';
import { GenericEditComponent } from '../../utils/generic-edit/generic-edit.component';

@Component({
    selector: 'dms-origin-edit',
    templateUrl: './origin-edit.component.html',
    styleUrl: './origin-edit.component.css',
    standalone: false
})
export class OriginEditComponent extends GenericEditComponent implements OnInit, OnDestroy  {

  @Output() closeModal = new EventEmitter();
  @Input() componentDescription: string = "";
  @ViewChild('manageForm', { static: false }) manageForm: NgForm;
  editMode : string = "";
  idItem : string = "";
  subscriptionManage: Subscription; 
  private navigationSubscription: Subscription;  //per la navigazione e forzare la init


  constructor( private originService: OriginService, private router: Router) {super()}

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

/****************************************
* Metodi generici di preparazione item
* 
******************************************/
  setItem(formValue : any) : OriginStruct {
    return  new OriginStruct({
      id: formValue.id,
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
    
    this.subscriptionManage = this.originService.manageItem.subscribe(
      (event: {item: any, mode: string}) => {
          var selectedItem = event.item as OriginStruct;
          this.editMode=event.mode;
          //console.log('modalità: ' + event.mode)
          
          setTimeout(() => {

                if (event.mode != "" && event.mode !="I" ) {
                  this.idItem = selectedItem.id;
                  this.manageForm.setValue({
                    
                    id: selectedItem.id,
                    dbType: selectedItem.dbType,
                    description: selectedItem.description,
                    status:selectedItem.enabled,
                    host: selectedItem.ip,
                    jdbc_custom_string: selectedItem.jdbcCustomString,
                    notes:selectedItem.note,
                    password: selectedItem.password,
                    port: selectedItem.port,
                    secure: selectedItem.secure,
                    user: selectedItem.user
                  })
                
                }
                if (event.mode ==="I"){
                  this.manageForm.reset();
                  this.manageForm.setValue({

                    id: '',
                    dbType: '',
                    description: '',
                    status:'S',
                    host:'',
                    jdbc_custom_string: '',
                    notes:'',
                    password: '',
                    port: '',
                    secure: 'N',
                    user: ''
                  })
                }
          }, );

      } 

    );

  }


}
