// generic-edit.component.ts
import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'dms-base-edit',
  standalone: false,
  templateUrl: './base-edit.component.html',
  styleUrl: './base-edit.component.css'
})
export abstract  class BaseEditComponent implements OnInit, OnDestroy {

  form!: FormGroup;
  submitted = false;
  previousFormValues: any = {};
  private subs: Subscription[] = [];

  /** Evento emesso al submit valido */
  @Output() manage = new EventEmitter<{ value: any, mode: string }>();

  constructor(protected fb: FormBuilder) {}

  ngOnInit() {
    // Costruisco il FormGroup con config e validator ereditabili
    this.form = this.fb.group(
      this.getControlsConfig(),
      { validators: this.getCrossFieldValidator() }
    );
    // Ogni volta che cambia un valore, posso reagire (es. per disabilitare/azzerare campi)
    this.subs.push(
      this.form.valueChanges.subscribe(() => this.onFormChanges())
    );
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  /** Deve restituire la configurazione dei controlli (child override) */
  protected abstract getControlsConfig():
    { [key: string]: any };

  /** Qui definisci validazioni sul FormGroup (child override) */
  protected getCrossFieldValidator(): ValidatorFn | null {
    return null;
  }

  /** Hook per reagire ai valueChanges (child override) */
  protected onFormChanges(): void {}


  /** Chiamato dal template */
  submit(mode: string) {
    this.submitted = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.manage.emit({ value: this.form.value, mode });
    this.submitted = false;
  }

  //metodo di verifica validità campo
  isInvalid(controlName: string): boolean {
    const control = this.form?.get(controlName);
    //return !!(control && control.invalid && (control.touched || control.dirty));
    return !!(control && control.invalid && Object.values(this.form.controls).some(c=>c.touched));
  }

}
