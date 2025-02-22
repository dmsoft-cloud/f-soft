import { Component,  Input, OnChanges, OnInit, Output, SimpleChanges, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


@Component({
  selector: 'dms-toogle-switch',
  templateUrl: './toggle-switch.component.html',
  styleUrl: './toggle-switch.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleSwitchComponent),  // replace name as appropriate
      multi: true
    }
  ]

})
export class ToggleSwitchComponent implements OnInit, ControlValueAccessor  {
  @Output() isOnSelected: boolean = true;
  name: string = "";
  @Input() id: string = "toggleSwitch"
  @Input() isSwitchDisabled: boolean = false;

  @Input() lableOn: string = "On";
  @Input() lableOff: string = "Off";
  @Input() lableComponent: string = "Status";
  @Input() valueOn: string = "S";
  @Input() valueOff: string = "N";
  @Input() value : string | boolean;
  @Input() defaultValue: string | boolean
  
  isRight: boolean = false;
  onChange: any = () => {};
  onTouched: any = () => {};


  constructor() { }
 
  ngOnInit(): void {
    if (this.value === undefined || this.value === null) {
      this.value = this.defaultValue !== undefined ? this.defaultValue : this.valueOn;
      this.isOnSelected = this.value === this.valueOn;
      this.isRight = this.isOnSelected;
      this.onChange(this.value);
    }
   
  }



  moveDiv() {
    this.isRight = !this.isRight;
  }

  toggleOn() {
    if (!this.isOnSelected) {
      this.isOnSelected = true;
      this.value=this.valueOn;
      this.moveDiv();
      this.onChange(this.value);  // Notify Angular form of the change
      this.onTouched();

    }
  }

  toggleOff() {
    if (this.isOnSelected) {
      this.isOnSelected = false;
      this.value=this.valueOff;
      this.moveDiv();
      this.onChange(this.value);  // Notify Angular form of the change
      this.onTouched();
    }
  }




  //metodi da implementare per estendere ControlValueAccessor
  
  writeValue(value: any): void {
    if (value !== undefined && value !== null) {
      this.value = value;
      if (value !== this.valueOn && this.isRight!=true ) {
        this.moveDiv();
        this.isOnSelected = false;
        this.value=this.valueOff;
      }
      if (value !== this.valueOff && this.isRight!=false ) {
        this.moveDiv();
        this.isOnSelected = true;
        this.value=this.valueOn;
      }
    } else 
    {
      console.log("valore default toggle" + this.defaultValue);
      this.value = this.defaultValue !== undefined ? this.defaultValue : this.valueOn;
      this.isOnSelected = this.value === this.valueOn;
      this.isRight = this.isOnSelected;
    }
  }
  

/*
  writeValue(value: any): void {
    if (value !== undefined && value !== null) {
      this.value = value;
      this.isOnSelected = value === this.valueOn;
      this.isRight = this.isOnSelected;
    } else 
    {
      this.value = this.defaultValue !== undefined ? this.defaultValue : this.valueOn;
      this.isOnSelected = this.value === this.valueOn;
      this.isRight = this.isOnSelected;
    }
  }
*/

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    //console.log("impostata a disabilitato ...." + isDisabled);
    this.isSwitchDisabled=isDisabled;
    //console.log("impostata lo switch a ...." + isDisabled);
  }


}