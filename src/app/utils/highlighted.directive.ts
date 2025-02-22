import { Directive, HostListener, HostBinding, ElementRef, Renderer2  } from '@angular/core';

@Directive({
  selector: '[appHighlighted]'
})
export class HighlightedDirective {
 @HostBinding('style.backgroundColor') backgroundColor : string = 'transparent';

  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') mouseover(eventdata: Event){ 
    this.backgroundColor='blue';
  }

  @HostListener('mouseleave') mouseleave(eventdata: Event){ 
    this.backgroundColor='transparent';
  }


  

}