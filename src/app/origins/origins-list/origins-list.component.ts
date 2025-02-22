import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { OriginService } from '../origin.service';
import { DefaultTableComponent } from '../../utils/default-table/default-table.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, tap } from 'rxjs';
import { OriginStruct } from '../../utils/structs/originStruct';

@Component({
  selector: 'dms-origins-list',
  templateUrl: './origins-list.component.html',
  styleUrl: './origins-list.component.css'
})
export class OriginsListComponent extends DefaultTableComponent  implements OnInit, OnDestroy {

  //usato per popolare i bottoni e le etichette generiche
  @Input() componentDescription: string;
  @ViewChild(DefaultTableComponent) defaultTableComponent!: DefaultTableComponent;

  isLoading =false;
  isError: string = null;

  subscription: Subscription;

  constructor(private originService: OriginService, private modalServiceF: NgbModal, private elF: ElementRef )  {
    super(modalServiceF, elF);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.loadTableData();

  }

  loadTableData(){
    this.columns = [
      { header: 'Id', field: 'id', type: '' },
      { header: 'Description', field: 'description', type: '' },
      { header: 'DB type', field: 'dbType', type: '' },
      { header: 'Host', field: 'ip', type: '' },
      { header: 'Enabled', field: 'enabled', type: 'enabled' }
    ];
    if (this.subscription) this.subscription.unsubscribe();
    this.subscription = this.originService.originChanged.subscribe(
      (origins: OriginStruct[]) => {
        this.items = origins;
        //console.log('Dati passati agli item della tabella :', this.items );
        this.applyFilter();
      }
    );

    this.originService.getOrigins().pipe(tap({
        next: resData => {
          console.log('Dati ricevuti:', resData);
          this.isLoading=false;
          this.isError=null;
          origins => {this.items = origins}
      },

        error: err => {
          console.log('Errore: ', err);
          this.isError = 'Error on service!  '
          this.isLoading= false;
        }
      })
    )
    .subscribe();
  }


  onSelectItem(event : {item: any, mode: string}): void {
    this.originService.startedEditing.next(event);
  }

  onManageItem(event : {item: any, mode: string}): void {
    this.originService.manageItem.next(event);
  }


  refreshTable(): void {
    this.applyFilter();
  }

  onCloseModal(){
    this.defaultTableComponent.closeModal();
  }

  clearErr(){
    this.isError=null;
    this.isLoading=false;
  }

}
