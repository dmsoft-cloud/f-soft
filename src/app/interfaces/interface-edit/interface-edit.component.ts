import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { filter, Subscription } from 'rxjs';
import { InterfaceService } from '../interface.service';
import { InterfaceStruct } from '../../utils/structs/interfaceStruct';
import { NavigationEnd, Router } from '@angular/router';
import { GenericEditComponent } from '../../utils/generic-edit/generic-edit.component';
import { isTemplateExpression } from 'typescript';
import { enumToSelectOptions, SelectOption } from '../../utils/select-custom/select-option.model';
import { ConnectionTypeEnum } from '../../utils/baseEntity';


@Component({
    selector: 'dms-interface-edit',
    templateUrl: './interface-edit.component.html',
    styleUrl: './interface-edit.component.scss',
    standalone: false
})
export class InterfaceEditComponent extends GenericEditComponent implements OnInit {

  @Output() closeModal = new EventEmitter();
  @Input() componentDescription: string = "";
  @ViewChild('manageForm', { static: false }) manageForm: NgForm;

  activeTab: string = 'basicData';  //serve per vedere quale tab è attivo tra quelli presenti

  connType: string=""; //tipo di connessione inizializzazione valore
  secureFtp: string = 'N'; // inizializzazione valore

  editMode : string = "";
  idItem : string = "";
  subscriptionManage: Subscription; 
  private navigationSubscription: Subscription;  //per la navigazione e forzare la init


  //campi del select custom
  connectionTypes: SelectOption[] = []; // Opzioni della select

  constructor( private interfaceService: InterfaceService , private router: Router) {super()}

  get isEditEnabled(): boolean {
    return (this.editMode === 'E' || this.editMode === 'C' || this.editMode === 'I');
  }

  ngOnInit(): void {
    this.setupNavigationListener();
    this.connectionTypes = enumToSelectOptions(ConnectionTypeEnum);
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
          this.interfaceService.emitClearAfetrDelete();
        break;
      case 'C':
        this.addItem(formValue);
        break;
      case 'E':
          this.updateItem(formValue);
          this.interfaceService.emitResetAfetrUpdate(formValue);
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
  setItem(formValue : any) : InterfaceStruct {
    return  new InterfaceStruct({
      id: formValue.id,
      description: formValue.description,
      connectionType: formValue.connectionType,
      passiveMode: formValue.passiveMode,
      secureFtp: formValue.secureFtp,
      host: formValue.host,
      port: formValue.port,
      user: formValue.user,
      password: formValue.password,
      sftpAlias: formValue.sftpAlias,
      knownHost: formValue.knownhost,
      keyFile: formValue.keyFile,
      trustHost: formValue.trustHost,
      enabled: formValue.status,
      note: formValue.notes
    });
  }

  addItem(formValue : any){
    console.log("Valori arrivati dal form di inserimento:", JSON.stringify(formValue));
    this.interfaceService.addItem(this.setItem(formValue));
  }

  deleteItem(formValue : any){
    this.interfaceService.deleteItem(this.setItem(formValue));
  }

  updateItem(formValue : any){
    this.interfaceService.updateItem(this.setItem(formValue));
  }

  
  submitForm(form: NgForm) {
    if (this.editMode === 'E') {
      form.value.id = this.idItem;  // Assegna il valore manualmente
    } 
    if (form) {
      form.ngSubmit.emit();
    }
  }
  
  
  private onNavigationEnd(): void {
    // Logica che vuoi eseguire ogni volta che c'è una navigazione
    this.initializeComponent();
  }

  private initializeComponent(): void {
  
    this.subscriptionManage = this.interfaceService.manageItem.subscribe(
      (event: {item: any, mode: string}) => {
        var selectedItem = event.item as InterfaceStruct;
        this.editMode=event.mode;
          /*console.log('modalità: ' + event.mode);
          console.log('item trasmesso: ' + JSON.stringify(event.item))*/
          setTimeout(() => {
            if (event.mode != "" && event.mode !="I" ) {
              this.idItem=selectedItem.id;
              this.manageForm.setValue({

                id: selectedItem.id,
                description: selectedItem.description,
                connectionType: selectedItem.connectionType,
                passiveMode: selectedItem.passiveMode,
                secureFtp:selectedItem.secureFtp,
                host:selectedItem.host,
                port:selectedItem.port,
                user:selectedItem.user,
                password: selectedItem.password,
                sftpAlias: selectedItem.sftpAlias,
                knownhost: selectedItem.knownHost,
                keyFile: selectedItem.keyFile,
                trustHost: selectedItem.trustHost,
                status:selectedItem.enabled,
                notes:selectedItem.note

              })
            
            }
            if (event.mode ==="I"){
              this.manageForm.reset();
              this.manageForm.setValue({

                id: '',
                description: '',
                connectionType: '',
                passiveMode: 'N',
                secureFtp:'N',
                host:'',
                port:'',
                user:'',
                password: '',
                sftpAlias: '',
                knownhost: '',
                keyFile: '',
                trustHost: 'N',
                status:'S',
                notes:''
              })
            }

          }, );

      } 
    );

  }

}
