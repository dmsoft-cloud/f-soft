import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DefaultTableComponent } from '../../utils/default-table/default-table.component';
import { LogService } from '../log.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, tap } from 'rxjs';
import { LogStruct } from '../../utils/structs/logStruct';


@Component({
    selector: 'dms-logs-list',
    templateUrl: './logs-list.component.html',
    styleUrl: './logs-list.component.css',
    standalone: false
})
export class LogsListComponent extends DefaultTableComponent  implements OnInit, OnDestroy {

  @Input() componentDescription: string;
  @ViewChild(DefaultTableComponent) defaultTableComponent!: DefaultTableComponent;

  isLoading =false;
  isError: string = null;
  subscription: Subscription;

  isEditOpen = false;

  constructor(private logService: LogService, private modalServiceF: NgbModal, private elF: ElementRef) {
    super(modalServiceF, elF);
  }

  get isModalActive(): boolean {
    let val = super.isModalActive ? true : false;
    return  val  ;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.loadTableData();

  }

  onCloseModal(){
    this.defaultTableComponent.closeModal();
    this.isEditOpen = false; 
  }

  loadTableData(){
    this.columns = [
      { header: 'Id', field: 'logProgrLog', type: '' },
      { header: 'Flow Id ', field: 'logId', type: '' },
      { header: 'Result', field: 'logEsito', type: '' },
      { header: 'Timestamp Start', field: 'logTsInizio', type: '' },
      { header: 'Timestamp End', field: 'logTsFine', type: '' },
      { header: 'Direction', field: 'logDirezione', type: '' }
    ];

    if (this.subscription) this.subscription.unsubscribe();
    this.subscription = this.logService.logChanged.subscribe(
              (logs: LogStruct[]) => {
                this.items = logs;
                this.applyFilter();
              }
    );
    
        this.logService.getLogs().pipe(tap({
            next: resData => {
              console.log('Dati ricevuti:', resData);
              this.isLoading=false;
              this.isError=null;
              interfaces => {this.items = interfaces}
          },
    
            error: err => {
              console.log('Errore: ', err);
              this.isError = 'Error on service!  '
              this.isLoading= false;
            }
          })
        ).subscribe();
  }

  refreshTable() {
    // Ricarica i dati della tabella senza perdere i filtri attivi
    this.loadTableData(); // Ricarica i dati e applica i filtri
  }

    onManageItem(event : {item: any, mode: string}): void {
    this.logService.manageItem.next(event);
    this.isEditOpen = true;
  }

}
