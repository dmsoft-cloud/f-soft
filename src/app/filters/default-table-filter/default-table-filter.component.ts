import { Component, Input, Output, EventEmitter, ViewChild, ViewContainerRef, ComponentRef, OnChanges, SimpleChanges } from '@angular/core';
import { FlowsFilterFormComponent } from '../flows-filter-form/flows-filter-form.component';


@Component({
    selector: 'dms-default-table-filter',
    templateUrl: './default-table-filter.component.html',
    styleUrl: './default-table-filter.component.css',
    standalone: false
})
export class DefaultTableFilterComponent {
  @Input() module: string = ''; // es. "flows", "origin"
  @Output() applyClicked = new EventEmitter<any>();
  @Output() resetClicked = new EventEmitter<void>();


  @ViewChild(FlowsFilterFormComponent) filterForm!: FlowsFilterFormComponent;


  constructor() { }

 


  onApply(): void {
    this.applyClicked.emit(null);
  }

  onReset() {
    this.resetClicked.emit(); // notifica il parent
  }

}
