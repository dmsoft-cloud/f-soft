import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericWizardComponent } from '../../utils/generic-wizard/generic-wizard.component';
import { FlowGoupSectionWizardComponent } from './flow-goup-section-wizard/flow-goup-section-wizard.component';
import { FlowModelSectionWizardComponent } from './flow-model-section-wizard/flow-model-section-wizard.component';
import { FlowOriginSectionWizardComponent } from './flow-origin-section-wizard/flow-origin-section-wizard.component';
import { FlowInterfaceSectionWizardComponent } from './flow-interface-section-wizard/flow-interface-section-wizard.component';
import { FlowWizardData } from './flow-wizard-data.interface';
import { FlowWizardStateService } from './flow-wizard-state.service';
import { FlowLastSectionWizardComponent } from './flow-last-section-wizard/flow-last-section-wizard.component';

@Component({
  selector: 'dms-flow-wizard',
  standalone: false,
  templateUrl: './flow-wizard.component.html',
  styleUrl: './flow-wizard.component.css'
})
export class FlowWizardComponent implements AfterViewInit {

  /**************************************
  *   campi descrittivi del singolo step
  ***************************************/
  groupCardTitle = 'Flow Wizard - Group Selection';
  groupCardText = 'Select an existing group or create a new one';
  groupCardImage = 'assets/img/flow_dark.png';

  modelCardTitle = 'Flow Wizard - Model Settings';
  modelCardText = 'Select an existing model or Configure your new data model settings';
  modelCardImage = 'assets/img/flow_dark.png';

  originCardTitle = 'Flow Wizard - Origin Settings';
  originCardText = 'Select or configure the origin';
  originCardImage = 'assets/img/flow_dark.png';

  interfaceCardTitle = 'Flow Wizard - Interface Settings';
  interfaceCardText = 'Select or configure the interface';
  interfaceCardImage = 'assets/img/flow_dark.png';

  flowCardTitle = 'Flow Wizard - Final Settings';
  flowCardText = 'Complete your specific flow data';
  flowCardImage = 'assets/img/flow_dark.png';

  @ViewChild(FlowGoupSectionWizardComponent) groupStep!: FlowGoupSectionWizardComponent;
  @ViewChild(FlowModelSectionWizardComponent) modelStep!: FlowModelSectionWizardComponent;
  @ViewChild(FlowOriginSectionWizardComponent) originStep!: FlowOriginSectionWizardComponent;
  @ViewChild(FlowInterfaceSectionWizardComponent) interfaceStep!: FlowInterfaceSectionWizardComponent;
  @ViewChild(FlowLastSectionWizardComponent) lastSectionComponent!: FlowLastSectionWizardComponent;
  @ViewChild('wiz') wizard!: GenericWizardComponent;

  /** Single object that aggregates each step's data */
  wizardData: FlowWizardData = {};

  /** single step status - used to check validity  */
  stepValidity: boolean[] = [ false, false, false, false, false ];


  /** IDs for pre-population */
  selectedGroupId?: string;
  selectedModelId?: string;
  selectedOriginId?: string;
  selectedInterfaceId?: string;


  constructor(public activeModal: NgbActiveModal,  private wizardState: FlowWizardStateService) {}

  ngAfterViewInit(): void {
    //carico i vari stati già presenti per caricarlo quando mi sposto tra gli step
    const saved = this.wizardState;
    saved.resetState();
    this.wizardData.group = saved.getStateValue('group');
    this.wizardData.model = saved.getStateValue('model');
    this.wizardData.origin = saved.getStateValue('origin');
    this.wizardData.interface = saved.getStateValue('interface');
    

    //sett id per collegarlo al template
    this.selectedGroupId = this.wizardData.group?.id;
    this.selectedModelId = this.wizardData.model?.id;
    this.selectedOriginId = this.wizardData.origin?.id;
    this.selectedInterfaceId = this.wizardData.interface?.id;
    
  }

  close() {
      this.activeModal.dismiss();
  }

  handleItemCreated(newId: string) {
    this.storeSelectedItem(newId);
  }

  onStepCompleted() {
    // avanti nel vero wizard
    this.wizard.nextStep();
  }

  storeSelectedItem(newId: string){
    const step = this.wizard.currentStep;
    switch (step) {
      case 0: // Group step
        this.selectedGroupId = newId;
        // use the selected object from the child component
        this.wizardData.group = this.groupStep?.selectedGroup!;
        this. wizardState.updateState('group', this.wizardData.group);
        break;
      case 1: // Model step
        this.selectedModelId = newId;
        this.wizardData.model = this.modelStep?.selectedModel!;
        this.wizardState.updateState('model', this.wizardData.model);
        break;
      case 2: // Origin step
        this.selectedOriginId = newId;
        this.wizardData.origin = this.originStep?.selectedOrigin!;
        this.wizardState.updateState('origin', this.wizardData.origin);
        break;
      case 3: // Interface step
        this.selectedInterfaceId = newId;
        this.wizardData.interface = this.interfaceStep?.selectedInterface!;
        this.wizardState.updateState('interface', this.wizardData.interface);
        break;
    }
    this.stepValidity[step] = true;
    this.wizard.stepValidity = this.stepValidity;
  }

  /** Metodo di fine wizard */
  finish(): void {
    // Here you have a complete FlowWizardData in this.wizardData
    this.activeModal.close(this.wizardData);
  }

  setStepValidity(isValid: boolean) {
    const i = this.wizard.currentStep;
    this.stepValidity[i] = isValid;
    this.wizard.stepValidity = this.stepValidity;
  }

  
  activeCompleteWizard(validity : boolean){
    this.stepValidity[4]=validity;
  }

 
  onWizardFinished() {
    if (this.lastSectionComponent) {
      if (this.lastSectionComponent.form.valid) {
            const result = this.lastSectionComponent.submitForm();
            this.close();
        } else {
            console.error('Form non valido, chiusura annullata');
        }
    } else {
        this.close();
    }
  }

}
