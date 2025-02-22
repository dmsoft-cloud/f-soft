import { Component, Input, Output, EventEmitter, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectOption } from './select-option.model';


@Component({
  selector: 'dms-select-custom',
  templateUrl: './select-custom.component.html',
  styleUrl: './select-custom.component.css',
  providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SelectCustomComponent), 
        multi: true
      }
    ]
})
export class SelectCustomComponent implements OnInit, ControlValueAccessor {

  @Input() label: string = 'Select an option';
  @Input() options: SelectOption[] = []; // Opzioni della select
  @Input() value: string = '';
  @Input() isDisabled: boolean = false;
  @Input() displayMode: 'code-description' | 'code' | 'description' = 'code-description';
  @Input() defaultValue?: string; // input per il valore predefinito
  @Input() id: string = 'custom-select';

  @Input() showEmptyOption: boolean = false; // Abilita o disabilita la riga vuota
  @Input() emptyOptionValue: string = ''; // Valore della riga vuota
  @Input() emptyOptionLabel: string = '--- Seleziona ---'; // Testo della riga vuota

  //private innerValue: string = '';

  //@Output() valueChange = new EventEmitter<string>();

  ngOnInit() {
    if (!this.options) {
      this.options = [];
    }
    if (!this.value && this.defaultValue) {
      this.value = this.defaultValue || this.emptyOptionValue;
      this.onChange(this.value);
    }
  }


  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: string): void {
    if (value) {
      this.value = value;
    } else if (this.defaultValue) {
      this.value = this.defaultValue;
    } else if (this.showEmptyOption) {
      this.value = this.emptyOptionValue;
    }
    this.onChange(this.value);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onValueChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }

  getOptionLabel(option: SelectOption): string {
    switch (this.displayMode) {
      case 'code':
        return option.code;
      case 'description':
        return option.description;
      default:
        return `${option.code} - ${option.description}`;
    }
  }

}
