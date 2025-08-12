import { ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { map, Observable } from 'rxjs';
import { FormBuilder, NgForm } from '@angular/forms';
import { InterfaceService } from '../../../interfaces/interface.service';
import { Router } from '@angular/router';
import { FlowWizardStateService } from '../flow-wizard-state.service';
import { InterfaceEditComponent } from '../../../interfaces/interface-edit/interface-edit.component';
import { InterfaceStruct } from '../../../utils/structs/interfaceStruct';
import { SelectOption } from '../../../utils/select-custom/select-option.model';

@Component({
  selector: 'dms-flow-interface-section-wizard',
  standalone: false,
  templateUrl: './flow-interface-section-wizard.component.html',
  styleUrl: './flow-interface-section-wizard.component.css'
})
export class FlowInterfaceSectionWizardComponent extends InterfaceEditComponent {

  
  /**********************************
   *   elmenti per campi select
  ***********************************/
    @Input() initialInterfaceId: string;
    @Output() stepCompleted = new EventEmitter();
    
    //rivedere se togliere 
    interfaceId: string="";
    interfaceOptions$: Observable<SelectOption[]>;
    
    @Output() interfaceCreated = new EventEmitter<string>();
    @Output() selection = new EventEmitter<string>();
    @Output() validityChange  = new EventEmitter<boolean>();
    
    //per valorizzazione campo form
    enabled = 'S';
    
    isNewMode = false;
    isCopyMode = false;
    isViewMode = false;
    selectedInterface?: InterfaceStruct;
    interfaceData: Partial<InterfaceStruct> = {};
    


    editMode: string = 'I';

    @ViewChild('manageForm', { static: false }) manageForm: NgForm;

  constructor(protected  interfaceService: InterfaceService, protected  router: Router, protected cd: ChangeDetectorRef, protected fb: FormBuilder, private stateService: FlowWizardStateService) {super(interfaceService, router, fb)}

  ngOnInit(): void {
    super.ngOnInit();
    this.interfaceOptions$ = this.interfaceService.getInterfaces().pipe(
    map(interfaces => interfaces.map(interfaceItem => ( {   
        code: interfaceItem.id, // Usa l'ID come valore
        description: interfaceItem.description // Usa la descrizione come testo visibile
      })))
    );

    // Inizializza con l'ID  se presente
    if (this.initialInterfaceId) {
      this.interfaceId = this.initialInterfaceId;
      this.onInterfaceChange(this.initialInterfaceId);
    }

  }

  onInterfaceChange(id: string): void {
    this.resetModes();
    console.log(id);
    if (id) {
      this.interfaceService.getInterface(id).subscribe(interfaceItem => {
        this.selectedInterface = interfaceItem;
        this.initialInterfaceId = this.selectedInterface.id;
        this.isViewMode = true;
        this.interfaceService.manageItem.next({item : this.selectedInterface , mode : "S"});
        this.selection.emit(id);
        this.validityChange.emit(!!id);
      });
    } else {
      this.selectedInterface = undefined;
      this.initialInterfaceId = '';
      this.selection.emit(null);
      this.validityChange.emit(!!id);
    }
    this.editMode = '';
  }


  onNewInterface(): void {
    this.resetModes();
    this.isNewMode = true;
    this.editMode = 'I';
    this.interfaceService.manageItem.next({item : new InterfaceStruct , mode : this.editMode});
    this.interfaceData = {};
    this.interfaceId = '';
    this.validityChange.emit(false);
  }

  private resetModes(): void {
    this.isNewMode = false;
    this.isCopyMode = false;
    this.isViewMode = false;
  }

  override onManageRequest(formValue: any, mode: string): void {
    super.onManageRequest(formValue, mode);
    this.interfaceCreated.emit(formValue.id);
    this.stepCompleted.emit();
    this.validityChange.emit(true);

  }

  enableEdit(){
    this.form.enable({ emitEvent: false });
    this.isNewMode = false;
    this.isCopyMode = true;
    this.isViewMode = false;
    this.editMode = "C";
  }


  override submitForm(): void {
    this.manualErrors = this.manualErrors.filter(err => err !== 'Change Id to save a new item!');
    console.log('form submitted: ' + JSON.stringify(this.form.value));
    if (this.form.get('id').value === this.selectedInterface.id) {
        this.manualErrors.push("Change Id to save a new item!");
        return;
    }
    super.submitForm();
    this.interfaceCreated.emit(this.form.get('id').value);
    this.stepCompleted.emit();
    this.validityChange.emit(true);

  }



}
