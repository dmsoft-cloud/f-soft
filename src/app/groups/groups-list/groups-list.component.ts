import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GroupService } from '../group.service';
import { DefaultTableComponent } from '../../utils/default-table/default-table.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, tap } from 'rxjs';
import { GroupStruct } from '../../utils/structs/groupStruct';
import { DefaultTableNewComponent } from '../../utils/default-table-new/default-table-new.component';


@Component({
    selector: 'dms-groups-list',
    templateUrl: './groups-list.component.html',
    styleUrl: './groups-list.component.css',
    standalone: false
})
export class GroupsListComponent extends DefaultTableComponent  implements OnInit, OnDestroy {
  //usato per popolare i bottoni e le etichette generiche
  @Input() componentDescription: string;
  @ViewChild(DefaultTableComponent) defaultTableComponent!: DefaultTableComponent;

  isLoading =false;
  isError: string = null;

  subscription: Subscription;

  constructor(private groupService: GroupService, private modalServiceF: NgbModal, private elF: ElementRef )  {
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
      { header: 'ID', field: 'id', type: '', width: 250 },
      { header: 'Description', field: 'description', type: '', width: 400, minWidth: 400 },
      { header: 'Enabled', field: 'enabled', type: 'enabled' }
    ];
    this.subscription = this.groupService.groupChanged.subscribe(
      (groups: GroupStruct[]) => {
        this.items = groups;
        this.applyFilter();
      }
    );

    //this.items = this.groupService.getGroups();
    this.groupService.getGroups().pipe(tap({
        next: resData => {
          console.log('Dati ricevuti:', resData);
          this.isLoading=false;
          this.isError=null;
          groups => {this.items = groups}
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
    this.groupService.startedEditing.next(event);
  }

  onManageItem(event : {item: any, mode: string}): void {
    this.groupService.manageItem.next(event);
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
