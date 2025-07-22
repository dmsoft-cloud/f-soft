import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FlowEditComponent } from '../../flow-edit/flow-edit.component';
import { ModelStruct } from '../../../utils/structs/modelStruct';
import { InterfaceStruct } from '../../../utils/structs/interfaceStruct';
import { FlowService } from '../../flow.service';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { FlowWizardStateService } from '../flow-wizard-state.service';
import { GroupService } from '../../../groups/group.service';
import { ModelService } from '../../../models/model.service';
import { OriginService } from '../../../origins/origin.service';
import { InterfaceService } from '../../../interfaces/interface.service';
import { EmailService } from '../../../emails/email.service';
import { map } from 'rxjs';

@Component({
  selector: 'dms-flow-last-section-wizard',
  standalone: false,
  templateUrl: './flow-last-section-wizard.component.html',
  styleUrl: './flow-last-section-wizard.component.css'
})
export class FlowLastSectionWizardComponent extends FlowEditComponent {

  @Input() initialGroupId: string;
  @Input() initialModelId: string;
  @Input() initialOriginId: string;
  @Input() initialInterfaceId: string;

  @Output() activeCompleteWizard = new EventEmitter<boolean>();

      //per valorizzazione campo form
  enabled = 'S';
  editMode: string = 'I';




  constructor(protected  flowService: FlowService, protected  router: Router, protected cd: ChangeDetectorRef, 
                        protected fb: FormBuilder, private stateService: FlowWizardStateService,
                        protected groupService: GroupService, protected modelService: ModelService, 
                        protected originService: OriginService, protected interfaceService: InterfaceService, 
                        protected emailService: EmailService
                      )
                      {super(flowService, router, cd, fb, groupService, modelService, originService, interfaceService, emailService)}

  ngOnInit(): void {
    super.ngOnInit();

    this.form.patchValue({                  
                    groupId: this.initialGroupId,
                    model: this.initialModelId,
                    origin: this.initialOriginId,
                    interfaceId: this.initialInterfaceId,
                  });
  }
  
  override onFormChanges(){
    super.onFormChanges();
    if (!this.form.invalid){
       this.activeCompleteWizard.emit(true);
    }
    else this.activeCompleteWizard.emit(false);
  }
  

}
