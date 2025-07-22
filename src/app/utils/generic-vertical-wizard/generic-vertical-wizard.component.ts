import { Component, Input } from '@angular/core';
import { GroupStruct } from '../structs/groupStruct';
import { InterfaceStruct } from '../structs/interfaceStruct';
import { OriginStruct } from '../structs/originStruct';
import { ModelStruct } from '../structs/modelStruct';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'; 

@Component({
  selector: 'dms-generic-vertical-wizard',
  standalone: false,
  templateUrl: './generic-vertical-wizard.component.html',
  styleUrl: './generic-vertical-wizard.component.scss'
})
export class GenericVerticalWizardComponent {

  @Input() steps: string[] = [];
  currentStep = 1;
  maxStepReached = 1;


  constructor(public activeModal: NgbActiveModal) {}

  close() {
    this.activeModal.dismiss();
  }

  onNavClick(step: number) {
    if (step <= this.maxStepReached) {
      this.currentStep = step;
    }
  }


  prevStep() {
    if (this.currentStep > 1) this.currentStep--;
  }
  nextStep() {
    if (this.canProceed()) {
      this.currentStep++;
      this.maxStepReached = Math.max(this.maxStepReached, this.currentStep);
    }
  }
  finish() {
    // logica di submit finale
  }

  canProceed(): boolean {
    switch (this.currentStep) {

      default: return false;
    }
  }
  private advance() {
    this.maxStepReached = Math.max(this.maxStepReached, this.currentStep + 1);
  }

}
