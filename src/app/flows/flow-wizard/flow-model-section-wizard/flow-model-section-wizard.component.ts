import { ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ModelsEditComponent } from '../../../models/models-edit/models-edit.component';
import { map, Observable } from 'rxjs';
import { SelectOption } from '../../../utils/select-custom/select-option.model';
import { ModelStruct } from '../../../utils/structs/modelStruct';
import { FormBuilder, NgForm } from '@angular/forms';
import { ModelService } from '../../../models/model.service';
import { Router } from '@angular/router';
import { FlowWizardStateService } from '../flow-wizard-state.service';

@Component({
  selector: 'dms-flow-model-section-wizard',
  standalone: false,
  templateUrl: './flow-model-section-wizard.component.html',
  styleUrl: './flow-model-section-wizard.component.css'
})
export class FlowModelSectionWizardComponent extends ModelsEditComponent {

      /**********************************
    *   elmenti per campi select
    ***********************************/
    @Input() initialModelId: string;
    @Output() stepCompleted = new EventEmitter();

    //rivedere se togliere 
    modelId: string="";
    modelOptions$: Observable<SelectOption[]>;

    @Output() modelCreated = new EventEmitter<string>();
    @Output() selection = new EventEmitter<string>();
    @Output() validityChange  = new EventEmitter<boolean>();

    //per valorizzazione campo form
    enabled = 'S';

    isNewMode = false;
    isCopyMode = false;
    isViewMode = false;
    selectedModel?: ModelStruct;
    modelData: Partial<ModelStruct> = {};

    editMode: string = 'I';

    @ViewChild('manageForm', { static: false }) manageForm: NgForm;

  constructor(protected  modelService: ModelService, protected  router: Router, protected cd: ChangeDetectorRef, protected fb: FormBuilder, private stateService: FlowWizardStateService) {super(modelService, router, cd, fb)}

  ngOnInit(): void {
    super.ngOnInit();
    this.modelOptions$ = this.modelService.getModels().pipe(
    map(models => models.map(model => ({
      code: model.id, // Usa l'ID come valore
      description: model.description // Usa la descrizione come testo visibile
    })))
    );

    // Inizializza con l'ID  se presente
    if (this.initialModelId) {
      this.modelId = this.initialModelId;
      this.onModelChange(this.initialModelId);
    }

  }

  onModelChange(id: string): void {
    this.resetModes();
    if (id) {
      this.modelService.getModel(id).subscribe(model => {
        this.selectedModel = model;
        this.initialModelId = this.selectedModel.id;
        this.isViewMode = true;
        this.modelService.manageItem.next({item : this.selectedModel , mode : "S"});
        this.selection.emit(id);
        this.validityChange.emit(!!id);
      });
    } else {
      this.selectedModel = undefined;
      this.initialModelId = '';
      this.selection.emit(null);
      this.validityChange.emit(!!id);
    }
    this.editMode = '';
  }


  onNewModel(): void {
    this.resetModes();
    this.isNewMode = true;
    this.editMode = 'I';
    this.modelService.manageItem.next({item : new ModelStruct , mode : this.editMode});
    this.modelData = {};
    this.modelId = '';
    this.validityChange.emit(false);
  }

  private resetModes(): void {
    this.isNewMode = false;
    this.isCopyMode = false;
    this.isViewMode = false;
  }

  override onManageRequest(formValue: any, mode: string): void {
    this.checkForm(formValue, mode);
    super.onManageRequest(formValue, mode);
    this.modelCreated.emit(formValue.id);
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

  checkForm(formValue: any, mode: string): boolean {
    //in modalità copia obbligo a modificare il nomme 
    if (formValue.id === this.selectedModel.id) return false;

  }

  override submitForm(): void {
    this.manualErrors = this.manualErrors.filter(err => err !== 'Change Id to save a new item!');
    console.log('form submitted: ' + JSON.stringify(this.form.value));
    if (this.form.get('id').value === this.selectedModel.id) {
        this.manualErrors.push("Change Id to save a new item!");
        return;
    }
    super.submitForm();
    this.modelCreated.emit(this.form.get('id').value);
    this.stepCompleted.emit();
    this.validityChange.emit(true);

  }

   /** Quando cambia un valore, azzero/disabilito i campi correlati */
  protected onFormChanges() {
    const g = this.form;
    // se cambio type ≠ 'D', azzero database/schema
    if (g.get('type')?.value !== 'D') {
      g.patchValue({ database: '', schema: '' }, { emitEvent: false });
      this.showExportSection = false;
    }

    if (g.get('type')?.value === 'D') {
      this.showExportSection = true;
    }
    

    // se direction = 'I', disabilito compression
    if (g.get('direction')?.value === 'I') {
      g.get('compression')?.disable({ emitEvent: false });
      g.get('compression')?.setValue('N', { emitEvent: false });
      g.value.compression = 'N';
    } else {
      g.get('compression')?.enable({ emitEvent: false });
    }

    // se direction = 'O', disabilito decompression
    if (g.get('direction')?.value === 'O') {
      g.get('decompression')?.disable({ emitEvent: false });
      g.get('decompression')?.setValue('N', { emitEvent: false });
      g.value.decompression = 'N';
    } else {
      g.get('decompression')?.enable({ emitEvent: false });
    }
  }


}
