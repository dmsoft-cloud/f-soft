import {   Component, ContentChildren, QueryList, AfterContentInit, Input, Output, EventEmitter } from '@angular/core';
import { WizardStepDirective } from '../wizard-step.directive'; 
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorHandlerService } from '../error-handler.service';

@Component({
  selector: 'dms-generic-wizard',
  standalone: false,
  templateUrl: './generic-wizard.component.html',
  styleUrl: './generic-wizard.component.scss'
})
export class GenericWizardComponent implements AfterContentInit {

  /** Contenuto della Top Card */
  @Input() cardTitle = '';
  @Input() cardText  = '';
  @Input() cardImage = '';

  /** Array di flag per indicare se lo step i-esimo è valido */
  @Input() stepValidity: boolean[] = [];

  /** Template‐steps raccolti dal contenuto */
  @ContentChildren(WizardStepDirective) stepsTpl!: QueryList<WizardStepDirective>;
  steps: WizardStepDirective[] = [];

  /** Evento di chiusura/finish */
  @Output() finished = new EventEmitter<void>();
  @Output() prevSetpEvent = new EventEmitter<void>();
  @Output() goToEvent = new EventEmitter<number>();



  currentStep = 0;
  maxStepReached = 0;

  constructor(public activeModal: NgbActiveModal, private errorHandler: ErrorHandlerService) {}

  ngAfterContentInit() {
    this.steps = this.stepsTpl.toArray();
    this.goTo(0);
  }

  goTo(idx: number) {
    if (idx <= this.maxStepReached) {
      this.currentStep = idx;
    }
    this.goToEvent.emit(idx);
  }

  close() {
    this.activeModal.dismiss();
  }


  nextStep() {
    if (this.canProceed()) {
      this.currentStep++;
      this.maxStepReached = Math.max(this.maxStepReached, this.currentStep);
    }
    else {
     this.errorHandler.handleError(
        'Select your item or configure a new one '
      );
    }
  }

  /** Wrapper che può essere sovrascritto */
  goNext() {
    this.nextStep();
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
    this.prevSetpEvent.emit();
  }

  finish() {
    this.finished.emit();
  }

  canProceed(): boolean {
    return !!this.stepValidity[this.currentStep];
  }



  /***********************************/
  /*      Getter  valori card        */ 
  /***********************************/
  get currentCardTitle(): string {
    return this.steps[this.currentStep]?.cardTitle || '';
  }

  get currentCardText(): string {
    return this.steps[this.currentStep]?.cardText || '';
  }

  get currentCardImage(): string {
    return this.steps[this.currentStep]?.cardImage || '';
  }

}
