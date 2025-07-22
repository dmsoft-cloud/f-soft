import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: 'ng-template[dmsWizardStep]',
  standalone: false
})
export class WizardStepDirective {
  @Input('dmsWizardStep') label!: string;
  @Input() cardTitle: string;         
  @Input() cardText: string;          
  @Input() cardImage: string;        

  constructor(public templateRef: TemplateRef<any>) { }

}
