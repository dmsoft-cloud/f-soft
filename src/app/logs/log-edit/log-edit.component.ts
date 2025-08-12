import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { GenericEditComponent } from '../../utils/generic-edit/generic-edit.component';
import { filter, Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { LogService } from '../log.service';
import { LogStruct } from '../../utils/structs/logStruct';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'dms-log-edit',
  standalone: false,
  templateUrl: './log-edit.component.html',
  styleUrl: './log-edit.component.css'
})
export class LogEditComponent extends GenericEditComponent implements OnInit, OnDestroy {
  @Output() closeModal = new EventEmitter();
  @Input() componentDescription: string = "";
  editMode : string = "";
  @ViewChild('manageForm', { static: false }) manageForm: NgForm;
  subscriptionManage: Subscription;
  private navigationSubscription: Subscription;
  currentItem: LogStruct; 

  activeTab: string = 'basicData'; 
  
  constructor( protected  logService: LogService, protected  router: Router) {super()}

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

  /****************************************
* Metodi gestione componente
* 
******************************************/
  private onNavigationEnd(): void {
    // Logica che vuoi eseguire ogni volta che c'è una navigazione
    this.initializeComponent();
  }

    private initializeComponent(): void {
      
      this.subscriptionManage = this.logService.manageItem.subscribe(
        (event: {item: any, mode: string}) => {
            var selectedItem = event.item as LogStruct;
            this.editMode=event.mode;
            //console.log('modalità: ' + event.mode)
            
            setTimeout(() => {
                    this.currentItem = selectedItem;
             
            }, );
  
        } 
  
      );
  
    }




}
