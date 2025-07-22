import { Component, Output, EventEmitter, ViewChild, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { SelectOption } from '../../utils/select-custom/select-option.model';
import { NgForm } from '@angular/forms';
import { InterfaceService } from '../../interfaces/interface.service';
import { OriginService } from '../../origins/origin.service';
import { ModelService } from '../../models/model.service';

@Component({
  selector: 'dms-flows-filter-form',
  standalone: false,
  templateUrl: './flows-filter-form.component.html',
  styleUrl: './flows-filter-form.component.css'
})
export class FlowsFilterFormComponent implements OnInit {

  filters = {
    id: '',
    model: '',
    origin: '',
    interfaceId: '',
    direction: '',
    enabled: ''
  };

  @Output() filtersChanged = new EventEmitter<any>();
  @ViewChild('filterForm') filterForm: NgForm;

   /**********************************
    *   elmenti per campi select
    ***********************************/
    groupId: string="";
    groupOptions$: Observable<SelectOption[]>;
    model: string="";
    modelOptions$: Observable<SelectOption[]>;
    origin: string="";
    originOptions$: Observable<SelectOption[]>;
    interfaceId: string="";
    interfaceOptions$: Observable<SelectOption[]>;

  constructor(  private modelService: ModelService, 
      private originService: OriginService, private interfaceService: InterfaceService ) {}

  ngOnInit(): void {
    this.loadSelectFields(); 
  }
  

  emitFilters(formValue : any) {
    this.filters.id=formValue.id;
    this.filters.model=formValue.model;
    this.filters.origin=formValue.origin;
    this.filters.direction=formValue.direction;
    this.filters.enabled=formValue.enabled;

    this.filtersChanged.emit(this.filters);
  }

  public resetForm() {
    this.filterForm?.resetForm();
  }

  resetFilters(): void {
    this.filters = {
      id: '',
      model: '',
      origin: '',
      interfaceId: '',
      direction: '',
      enabled: ''
      // altri campi da resettare
    };
    this.model = '';
    this.origin = '';
  }


  loadSelectFields() :void {
  
      //inizializza combo modelli
      this.modelOptions$ = this.modelService.getModels().pipe(
        map(models => models.map(model => ({
          code: model.id, // Usa l'ID come valore
          description: model.description // Usa la descrizione come testo visibile
        })))
      );
  
      //inizializza combo origini
      this.originOptions$ = this.originService.getOrigins().pipe(
        map(origins => origins.map(origin => ({
          code: origin.id, // Usa l'ID come valore
          description: origin.description // Usa la descrizione come testo visibile
        })))
      );
  
  
      //inizializza combo interfacce
      this.interfaceOptions$ = this.interfaceService.getInterfaces().pipe(
        map(interfaces => interfaces.map(interfaceId => ({
          code: interfaceId.id, // Usa l'ID come valore
          description: interfaceId.description // Usa la descrizione come testo visibile
        })))
      );
  
    }

}
