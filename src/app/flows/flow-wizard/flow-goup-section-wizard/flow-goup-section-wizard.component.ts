import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { map, Observable } from 'rxjs';
import { SelectOption } from '../../../utils/select-custom/select-option.model';
import { GroupStruct } from '../../../utils/structs/groupStruct';
import { GroupService } from '../../../groups/group.service';
import { NgForm } from '@angular/forms';
import { GroupEditComponent } from '../../../groups/group-edit/group-edit.component';
import { Router } from '@angular/router';

@Component({
  selector: 'dms-flow-goup-section-wizard',
  standalone: false,
  templateUrl: './flow-goup-section-wizard.component.html',
  styleUrl: './flow-goup-section-wizard.component.css'
})
export class FlowGoupSectionWizardComponent extends GroupEditComponent {

    /**************************************
    *   elmenti per campi select
    ***************************************/
    @Input() initialGroupId: string;
    groupId: string="";
    groupOptions$: Observable<SelectOption[]>;

    @Output() groupCreated = new EventEmitter<string>();
    @Output() selection = new EventEmitter<string>();
    @Output() stepCompleted = new EventEmitter();
    @Output() validityChange  = new EventEmitter<boolean>();

    //per valorizzazione campo form
    enabled = 'S';

    isNewMode = false;
    isCopyMode = false;
    selectedGroup?: GroupStruct;
    groupData: Partial<GroupStruct> = {};

    editMode: string = 'I';

    @ViewChild('manageForm', { static: false }) manageForm: NgForm;

  constructor(protected  groupService: GroupService, protected  router: Router) {super(groupService, router)}

  ngOnInit(): void {
    this.groupOptions$ = this.groupService.getGroups().pipe(
    map(groups => groups.map(group => ({
      code: group.id, // Usa l'ID come valore
      description: group.description // Usa la descrizione come testo visibile
    })))
    );

    // Inizializza con l'ID del gruppo se presente
    if (this.initialGroupId) {
      this.groupId = this.initialGroupId;
      this.onGroupChange(this.initialGroupId);
    }

  }

  onGroupChange(id: string): void {
    this.resetModes();
    console.log(id);
    if (id) {
      this.groupService.getGroup(id).subscribe(group => {
        this.selectedGroup = group;
        this.initialGroupId = this.selectedGroup.id;
        this.selection.emit(id);
        this.validityChange.emit(!!id);
      });
    } else {
      this.selectedGroup = undefined;
      this.initialGroupId = '';
      this.selection.emit(null);
      this.validityChange.emit(!!id);
    }
    this.editMode = '';
  }


  onNewGroup(): void {
    this.resetModes();
    this.isNewMode = true;
    this.editMode = 'I';
    this.groupData = {};
    this.groupId = '';
    this.validityChange.emit(false);
  }

  onIdChange(): void {
    // Logica se vuoi abilitare/disabilitare il salvataggio in base all'ID
  }

  private resetModes(): void {
    this.isNewMode = false;
    this.isCopyMode = false;
  }

  override onManageRequest(formValue: any, mode: string): void {
    super.onManageRequest(formValue, mode);
    this.groupCreated.emit(formValue.id);
    this.stepCompleted.emit();
    this.validityChange.emit(true);
  }

}
