import { ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { OriginStruct } from '../../../utils/structs/originStruct';
import { OriginEditComponent } from '../../../origins/origin-edit/origin-edit.component';
import { map, Observable } from 'rxjs';
import { FormBuilder, NgForm } from '@angular/forms';
import { OriginService } from '../../../origins/origin.service';
import { Router } from '@angular/router';
import { FlowWizardStateService } from '../flow-wizard-state.service';
import { SelectOption } from '../../../utils/select-custom/select-option.model';

@Component({
  selector: 'dms-flow-origin-section-wizard',
  standalone: false,
  templateUrl: './flow-origin-section-wizard.component.html',
  styleUrl: './flow-origin-section-wizard.component.css'
})
export class FlowOriginSectionWizardComponent extends OriginEditComponent  {

  
      /**********************************
    *   elmenti per campi select
    ***********************************/
    @Input() initialOriginId: string;
    @Output() stepCompleted = new EventEmitter();

    //rivedere se togliere 
    originId: string="";
    originOptions$: Observable<SelectOption[]>;

    @Output() originCreated = new EventEmitter<string>();
    @Output() selection = new EventEmitter<string>();
    @Output() validityChange  = new EventEmitter<boolean>();

    //per valorizzazione campo form
    enabled = 'S';

    isNewMode = false;
    isCopyMode = false;
    isViewMode = false;
    selectedOrigin?: OriginStruct;
    originData: Partial<OriginStruct> = {};

    editMode: string = 'I';

    //@ViewChild('manageForm', { static: false }) manageForm: NgForm;

  constructor(protected  originService: OriginService, protected  router: Router, protected cd: ChangeDetectorRef, protected fb: FormBuilder, private stateService: FlowWizardStateService) {super(originService, router, fb)}

  ngOnInit(): void {
    super.ngOnInit();
    this.originOptions$ = this.originService.getOrigins().pipe(
    map(origins => origins.map(origin => ({
      code: origin.id, // Usa l'ID come valore
      description: origin.description // Usa la descrizione come testo visibile
    })))
    );

    // Inizializza con l'ID  se presente
    if (this.initialOriginId) {
      this.originId = this.initialOriginId;
      this.onOriginChange(this.initialOriginId);
    }

  }

  onOriginChange(id: string): void {
    this.resetModes();
    console.log(id);
    if (id) {
      this.originService.getOrigin(id).subscribe(origin => {
        this.selectedOrigin = origin;
        this.initialOriginId = this.selectedOrigin.id;
        this.isViewMode = true;
        this.originService.manageItem.next({item : this.selectedOrigin , mode : "S"});
      });
    } else {
      this.selectedOrigin = undefined;
      this.initialOriginId = '';
    }
    this.editMode = '';
    this.selection.emit(id);
    this.validityChange.emit(!!id);
  }


  onNewOrigin(): void {
    this.resetModes();
    this.isNewMode = true;
    this.editMode = 'I';
    this.originService.manageItem.next({item : new OriginStruct , mode : this.editMode});
    this.originData = {};
    this.originId = '';
    this.validityChange.emit(false);
  }

  private resetModes(): void {
    this.isNewMode = false;
    this.isCopyMode = false;
    this.isViewMode = false;
  }

  override onManageRequest(formValue: any, mode: string): void {
    super.onManageRequest(formValue, mode);
    this.originCreated.emit(formValue.id);
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
    if (this.form.get('id').value === this.selectedOrigin.id) {
        this.manualErrors.push("Change Id to save a new item!");
        return;
    }
    super.submitForm();
    this.originCreated.emit(this.form.get('id').value);
    this.stepCompleted.emit();
    this.validityChange.emit(true);

  }

}
